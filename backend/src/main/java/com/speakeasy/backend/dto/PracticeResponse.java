package com.speakeasy.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PracticeResponse {
    private Long sessionId;
    private String said;
    private String fixed;
    private String better;
    private List<MistakeDto> mistakes;
    private Integer xpEarned;
    private Integer newXpTotal;
    private Integer currentStreak;
    private Boolean leveledUp;
    private String levelTitle;
    private Integer wordsPerMin;
    private Integer fillerCount;
    private String fillerRating; // Clean, Noticeable, Distracting
    private String paceRating;   // Slow, Building, Ideal, Rushed
}
