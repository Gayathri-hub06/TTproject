package com.speakeasy.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiCoachRequest {
    private Integer fearScore; // 1 to 5
    private String currentRole;
    private String levelTitle;
}
