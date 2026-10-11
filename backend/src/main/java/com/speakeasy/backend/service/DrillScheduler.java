package com.speakeasy.backend.service;

import com.speakeasy.backend.dto.DrillCardDto;
import com.speakeasy.backend.entity.DrillCard;
import com.speakeasy.backend.entity.Mistake;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.exception.ResourceNotFoundException;
import com.speakeasy.backend.repository.DrillCardRepository;
import com.speakeasy.backend.repository.MistakeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DrillScheduler {

    private final DrillCardRepository drillCardRepository;
    private final MistakeRepository mistakeRepository;
    private final RewardEngine rewardEngine;

    public List<DrillCardDto> getDueCards(Long userId) {
        LocalDate today = LocalDate.now();
        List<DrillCard> cards = drillCardRepository.findByUser_UserIdAndNextReviewDateLessThanEqual(userId, today);
        return cards.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public DrillCardDto recordAnswer(Long cardId, Long userId, boolean isCorrect) {
        DrillCard card = drillCardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Drill card not found with ID: " + cardId));

        if (!card.getUser().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Drill card does not belong to current user");
        }

        LocalDate today = LocalDate.now();
        if (isCorrect) {
            card.setTimesCorrect(card.getTimesCorrect() + 1);
            // Spaced Repetition Progression: 1 day -> 3 days -> 7 days -> 14 days
            int nextInterval;
            if (card.getIntervalDays() <= 1) {
                nextInterval = 3;
            } else if (card.getIntervalDays() <= 3) {
                nextInterval = 7;
            } else {
                nextInterval = 14;
            }
            card.setIntervalDays(nextInterval);
            card.setNextReviewDate(today.plusDays(nextInterval));

            // Award reward points for fixing mistake
            rewardEngine.awardDrillXp(card.getUser());
        } else {
            // Mistake repeated: reset interval to 1 day
            card.setIntervalDays(1);
            card.setNextReviewDate(today.plusDays(1));
        }

        drillCardRepository.save(card);
        return mapToDto(card);
    }

    @Transactional
    public List<DrillCardDto> generatePracticeDrills(Long userId) {
        // Find user's past mistakes and generate new cards if needed
        List<Mistake> mistakes = mistakeRepository.findBySession_User_UserId(userId);
        List<DrillCardDto> generated = new ArrayList<>();

        LocalDate today = LocalDate.now();
        for (Mistake m : mistakes) {
            boolean exists = drillCardRepository.findByUser_UserId(userId).stream()
                    .anyMatch(c -> c.getMistake().getMistakeId().equals(m.getMistakeId()));
            if (!exists) {
                DrillCard card = DrillCard.builder()
                        .user(m.getSession().getUser())
                        .mistake(m)
                        .nextReviewDate(today)
                        .intervalDays(1)
                        .timesCorrect(0)
                        .build();
                card = drillCardRepository.save(card);
                generated.add(mapToDto(card));
            }
        }
        return generated;
    }

    private DrillCardDto mapToDto(DrillCard card) {
        return DrillCardDto.builder()
                .cardId(card.getCardId())
                .mistakeId(card.getMistake().getMistakeId())
                .mistakeType(card.getMistake().getMistakeType())
                .originalPhrase(card.getMistake().getOriginalPhrase())
                .correction(card.getMistake().getCorrection())
                .explanation(card.getMistake().getExplanation())
                .nextReviewDate(card.getNextReviewDate())
                .intervalDays(card.getIntervalDays())
                .timesCorrect(card.getTimesCorrect())
                .build();
    }
}
