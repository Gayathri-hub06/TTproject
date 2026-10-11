package com.speakeasy.backend.dto;

import com.speakeasy.backend.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private Integer xpTotal;
    private Integer currentStreak;
    private Long levelId;
    private String levelTitle;
    private Integer nextLevelXp;
    private String targetRole;
    private Integer dailyGoalMinutes;
}
