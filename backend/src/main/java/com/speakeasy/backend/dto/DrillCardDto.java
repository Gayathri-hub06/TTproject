package com.speakeasy.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrillCardDto {
    private Long cardId;
    private Long mistakeId;
    private String mistakeType;
    private String originalPhrase;
    private String correction;
    private String explanation;
    private LocalDate nextReviewDate;
    private Integer intervalDays;
    private Integer timesCorrect;
}
