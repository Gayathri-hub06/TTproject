package com.speakeasy.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrillAnswerRequest {
    @NotNull(message = "isCorrect is required")
    private Boolean isCorrect;
}
