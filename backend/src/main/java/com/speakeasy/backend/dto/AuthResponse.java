package com.speakeasy.backend.dto;

import com.speakeasy.backend.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private Integer xpTotal;
    private Integer currentStreak;
    private Long levelId;
    private String levelTitle;
}
