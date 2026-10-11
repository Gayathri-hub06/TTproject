package com.speakeasy.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckinDto {
    private Long checkinId;
    private Long sessionId;
    private Integer fearBefore;
    private Integer fearAfter;
    private LocalDateTime createdAt;
}
