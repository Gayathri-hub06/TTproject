package com.speakeasy.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAttemptResponse {
    private Long attemptId;
    private Long questionId;
    private Integer score;
    private String feedback;
    private String followUpQuestion;
    private Integer xpEarned;
    private String pressureLevel;
}
