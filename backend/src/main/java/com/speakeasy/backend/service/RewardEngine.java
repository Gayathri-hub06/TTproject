package com.speakeasy.backend.service;

import com.speakeasy.backend.config.RewardProperties;
import com.speakeasy.backend.entity.*;
import com.speakeasy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RewardEngine {

    private final UserRepository userRepository;
    private final LevelRepository levelRepository;
    private final XpEventRepository xpEventRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final RewardProperties rewardProperties;

    @Transactional
    public RewardResult awardPracticeXp(User user, int wordsPerMin, int fillerCount, boolean isImprovedRepeat) {
        int points = isImprovedRepeat ? rewardProperties.getImprovedRepeatXp() : rewardProperties.getSentenceXp();
        String reason = isImprovedRepeat ? "Improved sentence repeated" : "Sentence practised";

        // Filler-free bonus (+5 pts if < 2 fillers per minute)
        if (wordsPerMin >= 60 && fillerCount <= 1) {
            points += rewardProperties.getFillerFreeBonus();
            reason += " (incl. Filler-Free bonus)";
            awardBadgeIfEligible(user, "Filler Slayer");
        }

        // Daily streak calculation
        updateStreak(user);

        // Streak bonus (+2 pts per day of current streak, capped at +20)
        int streakBonus = Math.min(user.getCurrentStreak() * rewardProperties.getStreakBonusPerDay(), rewardProperties.getStreakBonusCap());
        if (streakBonus > 0) {
            points += streakBonus;
        }

        // Apply points & create audit log
        user.setXpTotal(user.getXpTotal() + points);
        xpEventRepository.save(XpEvent.builder()
                .user(user)
                .points(points)
                .reason(reason)
                .build());

        // Check First Words badge
        awardBadgeIfEligible(user, "First Words");

        // Check 5-day streak badge
        if (user.getCurrentStreak() >= 5) {
            awardBadgeIfEligible(user, "Consistency Champion");
        }

        // Level check
        boolean leveledUp = checkLevelUp(user);
        userRepository.save(user);

        return new RewardResult(points, user.getXpTotal(), user.getCurrentStreak(), leveledUp,
                user.getLevel() != null ? user.getLevel().getTitle() : "Warm-up");
    }

    @Transactional
    public int awardDrillXp(User user) {
        int points = rewardProperties.getDrillCorrectXp();
        user.setXpTotal(user.getXpTotal() + points);
        xpEventRepository.save(XpEvent.builder()
                .user(user)
                .points(points)
                .reason("Mistake drill card answered correctly")
                .build());
        checkLevelUp(user);
        userRepository.save(user);
        return points;
    }

    @Transactional
    public int awardInterviewXp(User user, int score) {
        int points = rewardProperties.getInterviewAnswerXp();
        user.setXpTotal(user.getXpTotal() + points);
        xpEventRepository.save(XpEvent.builder()
                .user(user)
                .points(points)
                .reason("Mock interview answer completed")
                .build());

        if (score >= 85) {
            awardBadgeIfEligible(user, "Interview Ready");
        }

        checkLevelUp(user);
        userRepository.save(user);
        return points;
    }

    @Transactional
    public int awardCheckinXp(User user, int fearBefore, int fearAfter) {
        int points = rewardProperties.getCheckinXp();
        user.setXpTotal(user.getXpTotal() + points);
        xpEventRepository.save(XpEvent.builder()
                .user(user)
                .points(points)
                .reason("Confidence check-in completed")
                .build());

        if ((fearBefore - fearAfter) >= 2) {
            awardBadgeIfEligible(user, "Fear Conqueror");
        }

        checkLevelUp(user);
        userRepository.save(user);
        return points;
    }

    private void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        if (lastActive == null) {
            user.setCurrentStreak(1);
        } else if (lastActive.equals(today)) {
            // Already active today; retain streak
        } else if (lastActive.equals(today.minusDays(1))) {
            // Consecutive day
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        } else {
            // Gap day: reset to 1
            user.setCurrentStreak(1);
        }
        user.setLastActiveDate(today);
    }

    private boolean checkLevelUp(User user) {
        List<Level> levels = levelRepository.findAllByOrderByXpRequiredAsc();
        Level highestEligible = null;
        for (Level lvl : levels) {
            if (user.getXpTotal() >= lvl.getXpRequired()) {
                highestEligible = lvl;
            }
        }

        if (highestEligible != null && (user.getLevel() == null || highestEligible.getLevelId() > user.getLevel().getLevelId())) {
            user.setLevel(highestEligible);
            return true;
        }
        return false;
    }

    public void awardBadgeIfEligible(User user, String badgeName) {
        badgeRepository.findByName(badgeName).ifPresent(badge -> {
            if (!userBadgeRepository.existsByUser_UserIdAndBadge_BadgeId(user.getUserId(), badge.getBadgeId())) {
                userBadgeRepository.save(UserBadge.builder()
                        .user(user)
                        .badge(badge)
                        .build());
                log.info("Badge '{}' awarded to user '{}'", badgeName, user.getEmail());
            }
        });
    }

    public record RewardResult(int pointsEarned, int newTotal, int streak, boolean leveledUp, String levelTitle) {}
}
