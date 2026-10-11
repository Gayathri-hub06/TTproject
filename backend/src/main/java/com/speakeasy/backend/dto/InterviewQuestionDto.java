package com.speakeasy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewQuestionDto {
    private Long questionId;

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Question text is required")
    private String questionText;
}
