package com.speakeasy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long badgeId;

    @Column(nullable = false, unique = true, length = 60)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String ruleDescription;
}
