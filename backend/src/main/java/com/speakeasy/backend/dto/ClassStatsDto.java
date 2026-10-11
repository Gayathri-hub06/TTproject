package com.speakeasy.backend.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassStatsDto {
    private Long classId;
    private String className;
    private String joinCode;
    private Integer studentCount;
    private Double avgWordsPerMin;
    private Double avgFillerCount;
    private Double avgFearReduction;
    private Long totalSessionsCompleted;
    private Map<String, Integer> topFillerWords;
    private List<Double> weeklyPaceTrends;
    private List<Double> weeklyFearTrends;
}
