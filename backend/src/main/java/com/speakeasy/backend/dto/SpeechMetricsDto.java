package com.speakeasy.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpeechMetricsDto {
    private Integer wordsPerMin;
    private Integer fillerCount;
    private String fillerBreakdown;
    private Integer pauseCount;
    private Integer durationSec;
    private String wordPauses;
}
