package com.speakeasy.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionSummary {
    private Long sessionId;
    private LocalDateTime createdAt;
    private String mode;
    private String tone;
    private String originalText;
    private String correctedText;
    private String improvedText;
    private Integer wordsPerMin;
    private Integer fillerCount;
    private Integer pauseCount;
    private Integer durationSec;
    private String wordPauses;
    private Integer mistakeCount;
}
