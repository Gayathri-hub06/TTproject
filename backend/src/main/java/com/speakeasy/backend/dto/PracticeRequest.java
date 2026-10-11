package com.speakeasy.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PracticeRequest {

    @NotBlank(message = "Practice sentence cannot be empty")
    private String text;

    @Builder.Default
    private String mode = "SPEAKING"; // SPEAKING or TYPING

    @Builder.Default
    private String tone = "PROFESSIONAL";

    @Min(value = 0, message = "Words per minute cannot be negative")
    @Max(value = 400, message = "Words per minute out of range")
    @Builder.Default
    private Integer wordsPerMinute = 0;

    @Min(value = 0, message = "Filler count cannot be negative")
    @Builder.Default
    private Integer fillerCount = 0;

    private String fillerBreakdown; // JSON string

    @Min(value = 0, message = "Pause count cannot be negative")
    @Builder.Default
    private Integer pauseCount = 0;

    @Min(value = 0, message = "Duration cannot be negative")
    @Builder.Default
    private Integer durationSec = 0;

    private String wordPauses; // JSON string with pause intervals
}
