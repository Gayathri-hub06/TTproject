package com.speakeasy.backend.controller;

import com.speakeasy.backend.config.RewardProperties;
import com.speakeasy.backend.dto.InterviewQuestionDto;
import com.speakeasy.backend.dto.XpWeightsDto;
import com.speakeasy.backend.entity.InterviewQuestion;
import com.speakeasy.backend.exception.ResourceNotFoundException;
import com.speakeasy.backend.repository.InterviewQuestionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminQuestionController {

    private final InterviewQuestionRepository questionRepository;
    private final RewardProperties rewardProperties;

    @GetMapping("/questions")
    public ResponseEntity<Map<String, Object>> getQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("questionId").descending());
        Page<InterviewQuestion> qPage;

        if (search != null && !search.isBlank()) {
            qPage = questionRepository.findByRoleContainingIgnoreCaseOrQuestionTextContainingIgnoreCase(search, search, pageable);
        } else {
            qPage = questionRepository.findAll(pageable);
        }

        var dtos = qPage.getContent().stream().map(q -> InterviewQuestionDto.builder()
                .questionId(q.getQuestionId())
                .role(q.getRole())
                .category(q.getCategory())
                .questionText(q.getQuestionText())
                .build()).collect(Collectors.toList());

        Map<String, Object> resp = new HashMap<>();
        resp.put("content", dtos);
        resp.put("currentPage", qPage.getNumber());
        resp.put("totalElements", qPage.getTotalElements());
        resp.put("totalPages", qPage.getTotalPages());
        resp.put("size", qPage.getSize());

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/questions")
    public ResponseEntity<InterviewQuestionDto> createQuestion(@Valid @RequestBody InterviewQuestionDto dto) {
        InterviewQuestion q = InterviewQuestion.builder()
                .role(dto.getRole())
                .category(dto.getCategory())
                .questionText(dto.getQuestionText())
                .build();
        q = questionRepository.save(q);
        dto.setQuestionId(q.getQuestionId());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<InterviewQuestionDto> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody InterviewQuestionDto dto
    ) {
        InterviewQuestion q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));

        q.setRole(dto.getRole());
        q.setCategory(dto.getCategory());
        q.setQuestionText(dto.getQuestionText());
        questionRepository.save(q);
        dto.setQuestionId(q.getQuestionId());
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        InterviewQuestion q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));
        questionRepository.delete(q);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/xp-weights")
    public ResponseEntity<XpWeightsDto> getXpWeights() {
        return ResponseEntity.ok(XpWeightsDto.builder()
                .sentenceXp(rewardProperties.getSentenceXp())
                .improvedRepeatXp(rewardProperties.getImprovedRepeatXp())
                .topicTalkXp(rewardProperties.getTopicTalkXp())
                .interviewAnswerXp(rewardProperties.getInterviewAnswerXp())
                .drillCorrectXp(rewardProperties.getDrillCorrectXp())
                .checkinXp(rewardProperties.getCheckinXp())
                .fillerFreeBonus(rewardProperties.getFillerFreeBonus())
                .streakBonusPerDay(rewardProperties.getStreakBonusPerDay())
                .streakBonusCap(rewardProperties.getStreakBonusCap())
                .build());
    }

    @PutMapping("/xp-weights")
    public ResponseEntity<XpWeightsDto> updateXpWeights(@RequestBody XpWeightsDto dto) {
        if (dto.getSentenceXp() != null) rewardProperties.setSentenceXp(dto.getSentenceXp());
        if (dto.getImprovedRepeatXp() != null) rewardProperties.setImprovedRepeatXp(dto.getImprovedRepeatXp());
        if (dto.getTopicTalkXp() != null) rewardProperties.setTopicTalkXp(dto.getTopicTalkXp());
        if (dto.getInterviewAnswerXp() != null) rewardProperties.setInterviewAnswerXp(dto.getInterviewAnswerXp());
        if (dto.getDrillCorrectXp() != null) rewardProperties.setDrillCorrectXp(dto.getDrillCorrectXp());
        if (dto.getCheckinXp() != null) rewardProperties.setCheckinXp(dto.getCheckinXp());
        if (dto.getFillerFreeBonus() != null) rewardProperties.setFillerFreeBonus(dto.getFillerFreeBonus());
        if (dto.getStreakBonusPerDay() != null) rewardProperties.setStreakBonusPerDay(dto.getStreakBonusPerDay());
        if (dto.getStreakBonusCap() != null) rewardProperties.setStreakBonusCap(dto.getStreakBonusCap());
        return getXpWeights();
    }
}
