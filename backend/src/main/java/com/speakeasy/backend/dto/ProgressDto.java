package com.speakeasy.backend.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressDto {
    private Integer xpTotal;
    private Integer currentStreak;
    private String levelTitle;
    private Integer currentLevelXp;
    private Integer nextLevelXp;
    private Integer levelProgressPercent;
    private Long dueDrillsCount;
    private Long totalSessionsCount;
    private Double avgWordsPerMin;
    private Double avgFillerCount;
    private Double avgFearReduction;
    private List<ConfidenceDataPoint> fearCurve;
    private List<DailyActivity> weeklyActivity;
    private List<BadgeDto> badges;
    private List<SessionSummary> recentSessions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConfidenceDataPoint {
        private String date;
        private Integer fearBefore;
        private Integer fearAfter;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyActivity {
        private String day;
        private Integer sessionsCount;
        private Integer xpEarned;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BadgeDto {
        private Long badgeId;
        private String name;
        private String description;
        private Boolean unlocked;
        private String earnedAt;
    }
}
