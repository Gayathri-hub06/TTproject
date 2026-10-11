package com.speakeasy.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XpWeightsDto {
    private Integer sentenceXp;
    private Integer improvedRepeatXp;
    private Integer topicTalkXp;
    private Integer interviewAnswerXp;
    private Integer drillCorrectXp;
    private Integer checkinXp;
    private Integer fillerFreeBonus;
    private Integer streakBonusPerDay;
    private Integer streakBonusCap;
}
