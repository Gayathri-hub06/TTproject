package com.speakeasy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long levelId;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false)
    private Integer xpRequired;

    @Column(columnDefinition = "TEXT")
    private String description;
}
