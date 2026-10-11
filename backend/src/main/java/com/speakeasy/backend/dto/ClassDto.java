package com.speakeasy.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassDto {
    private Long classId;
    private String name;
    private String joinCode;
    private String teacherName;
    private Integer studentCount;
    private LocalDateTime createdAt;
}
