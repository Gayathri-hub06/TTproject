package com.speakeasy.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    @Size(min = 2, max = 60, message = "Display name must be between 2 and 60 characters")
    private String displayName;

    @Size(min = 2, max = 100, message = "Target role must be between 2 and 100 characters")
    private String targetRole;

    @Min(value = 5, message = "Daily goal must be at least 5 minutes")
    @Max(value = 180, message = "Daily goal cannot exceed 180 minutes")
    private Integer dailyGoalMinutes;
}
