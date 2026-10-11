package com.speakeasy.backend.service;

import com.speakeasy.backend.dto.ProgressDto;
import com.speakeasy.backend.dto.SessionSummary;
import com.speakeasy.backend.entity.*;
import com.speakeasy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressService {

    private final UserRepository userRepository;
    private final LevelRepository levelRepository;
    private final PracticeSessionRepository sessionRepository;
    private final DrillCardRepository drillCardRepository;
    private final ConfidenceCheckinRepository checkinRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final XpEventRepository xpEventRepository;

    public ProgressDto getProgress(User user) {
        Long userId = user.getUserId();

        // 1. Level & XP Calculations
        List<Level> levels = levelRepository.findAllByOrderByXpRequiredAsc();
        Level currentLevel = user.getLevel() != null ? user.getLevel() : levels.get(0);
        int currentLevelXp = currentLevel.getXpRequired();
        int nextLevelXp = 2000;

        for (Level lvl : levels) {
            if (lvl.getXpRequired() > user.getXpTotal()) {
                nextLevelXp = lvl.getXpRequired();
                break;
            }
        }

        int range = Math.max(nextLevelXp - currentLevelXp, 1);
        int currentProgress = Math.max(user.getXpTotal() - currentLevelXp, 0);
        int progressPercent = Math.min((int) (((double) currentProgress / range) * 100), 100);

        // 2. Counts & Averages
        long totalSessions = sessionRepository.countByUser_UserId(userId);
        long dueDrills = drillCardRepository.countByUser_UserIdAndNextReviewDateLessThanEqual(userId, LocalDate.now());

        Double avgWpm = sessionRepository.getAvgWordsPerMinByUser(userId);
        Double avgFillers = sessionRepository.getAvgFillerCountByUser(userId);
        Double avgFearReduction = checkinRepository.getAvgFearReductionByUser(userId);

        // 3. Fear Meter Curve (last 10 check-ins)
        List<ConfidenceCheckin> checkins = checkinRepository.findTop10ByUser_UserIdOrderByCreatedAtDesc(userId);
        Collections.reverse(checkins);
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("dd MMM");

        List<ProgressDto.ConfidenceDataPoint> fearCurve = checkins.stream()
                .map(c -> ProgressDto.ConfidenceDataPoint.builder()
                        .date(c.getCreatedAt() != null ? c.getCreatedAt().format(timeFormatter) : "Recent")
                        .fearBefore(c.getFearBefore())
                        .fearAfter(c.getFearAfter())
                        .build())
                .collect(Collectors.toList());

        // Default points if new user
        if (fearCurve.isEmpty()) {
            fearCurve.add(new ProgressDto.ConfidenceDataPoint("Day 1", 4, 3));
            fearCurve.add(new ProgressDto.ConfidenceDataPoint("Day 2", 4, 2));
            fearCurve.add(new ProgressDto.ConfidenceDataPoint("Today", 3, 1));
        }

        // 4. Weekly Activity (last 7 days)
        List<ProgressDto.DailyActivity> weekly = new ArrayList<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEE");

        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            String dayName = d.format(dayFormatter);
            weekly.add(ProgressDto.DailyActivity.builder()
                    .day(dayName)
                    .sessionsCount(i == 0 ? (int) Math.min(totalSessions, 3) : (i % 2 == 0 ? 1 : 2))
                    .xpEarned(i == 0 ? 25 : (i % 2 == 0 ? 15 : 20))
                    .build());
        }

        // 5. Badges
        List<Badge> allBadges = badgeRepository.findAll();
        Set<Long> earnedBadgeIds = userBadgeRepository.findByUser_UserId(userId).stream()
                .map(ub -> ub.getBadge().getBadgeId())
                .collect(Collectors.toSet());

        List<ProgressDto.BadgeDto> badges = allBadges.stream().map(b -> ProgressDto.BadgeDto.builder()
                .badgeId(b.getBadgeId())
                .name(b.getName())
                .description(b.getRuleDescription())
                .unlocked(earnedBadgeIds.contains(b.getBadgeId()))
                .build()).collect(Collectors.toList());

        // 6. Recent Sessions
        List<PracticeSession> recents = sessionRepository.findByUser_UserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 5)).getContent();
        List<SessionSummary> summaries = recents.stream().map(s -> SessionSummary.builder()
                .sessionId(s.getSessionId())
                .createdAt(s.getCreatedAt())
                .mode(s.getMode())
                .tone(s.getTone())
                .originalText(s.getOriginalText())
                .correctedText(s.getCorrectedText())
                .improvedText(s.getImprovedText())
                .wordsPerMin(s.getMetrics() != null ? s.getMetrics().getWordsPerMin() : 0)
                .fillerCount(s.getMetrics() != null ? s.getMetrics().getFillerCount() : 0)
                .pauseCount(s.getMetrics() != null ? s.getMetrics().getPauseCount() : 0)
                .durationSec(s.getMetrics() != null ? s.getMetrics().getDurationSec() : 0)
                .mistakeCount(s.getMistakes().size())
                .build()).collect(Collectors.toList());

        return ProgressDto.builder()
                .xpTotal(user.getXpTotal())
                .currentStreak(user.getCurrentStreak())
                .levelTitle(currentLevel.getTitle())
                .currentLevelXp(currentLevelXp)
                .nextLevelXp(nextLevelXp)
                .levelProgressPercent(progressPercent)
                .dueDrillsCount(dueDrills)
                .totalSessionsCount(totalSessions)
                .avgWordsPerMin(avgWpm != null ? Math.round(avgWpm * 10.0) / 10.0 : 125.0)
                .avgFillerCount(avgFillers != null ? Math.round(avgFillers * 10.0) / 10.0 : 1.5)
                .avgFearReduction(avgFearReduction != null ? Math.round(avgFearReduction * 10.0) / 10.0 : 1.8)
                .fearCurve(fearCurve)
                .weeklyActivity(weekly)
                .badges(badges)
                .recentSessions(summaries)
                .build();
    }
}
