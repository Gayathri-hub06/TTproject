package com.speakeasy.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiCoachResponse {
    private String prompt;
    private String difficulty; // GENTLE, MODERATE, CHALLENGING
    private String calmingTip;
    private String breathingCue; // e.g. "4-4-4 Box Breathing"
    private Boolean isAiGenerated;
}
