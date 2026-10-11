package com.speakeasy.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeDto {
    private Long mistakeId;
    private String mistakeType;
    private String originalPhrase;
    private String correction;
    private String explanation;
}
