package com.speakeasy.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyConfidenceStoryDto {
    private String story;
    private Boolean statsVerified;
    private Long totalSessions;
    private Double avgWordsPerMin;
    private Double avgFearReduction;
    private Integer currentStreak;
    private Boolean isAiGenerated;
}
