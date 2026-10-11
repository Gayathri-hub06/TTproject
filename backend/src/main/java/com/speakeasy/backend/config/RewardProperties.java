package com.speakeasy.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "speakeasy.reward")
@Getter
@Setter
public class RewardProperties {
    private int sentenceXp = 10;
    private int improvedRepeatXp = 5;
    private int topicTalkXp = 20;
    private int interviewAnswerXp = 30;
    private int drillCorrectXp = 5;
    private int checkinXp = 3;
    private int fillerFreeBonus = 5;
    private int streakBonusPerDay = 2;
    private int streakBonusCap = 20;
}
