package com.speakeasy.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAttemptRequest {
    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String spokenAnswer;

    @Builder.Default
    private String pressureLevel = "FRIENDLY"; // FRIENDLY, NEUTRAL, TOUGH

    private Integer durationSec;
    private Integer wordsPerMin;
    private Integer fillerCount;
}
