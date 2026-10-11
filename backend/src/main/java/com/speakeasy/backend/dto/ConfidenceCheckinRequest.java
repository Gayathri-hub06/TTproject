package com.speakeasy.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfidenceCheckinRequest {
    private Long sessionId;

    @NotNull(message = "Fear before is required")
    @Min(value = 1, message = "Fear rating must be between 1 and 5")
    @Max(value = 5, message = "Fear rating must be between 1 and 5")
    private Integer fearBefore;

    @NotNull(message = "Fear after is required")
    @Min(value = 1, message = "Fear rating must be between 1 and 5")
    @Max(value = 5, message = "Fear rating must be between 1 and 5")
    private Integer fearAfter;
}
