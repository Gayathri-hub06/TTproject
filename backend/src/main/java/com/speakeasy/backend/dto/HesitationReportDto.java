package com.speakeasy.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HesitationReportDto {
    private String diagnosis;
    private List<String> slowWords;
    private Double avgHesitationSeconds;
    private List<String> targetedExercises;
    private List<String> tongueTwisters;
    private Boolean isAiGenerated;
}
