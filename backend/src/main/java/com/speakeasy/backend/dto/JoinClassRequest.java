package com.speakeasy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinClassRequest {

    @NotBlank(message = "Join code is required")
    private String joinCode;
}
