package com.speakeasy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 60)
    private String displayName;

    @Column(length = 100)
    @Builder.Default
    private String targetRole = "Software Engineer";

    @Column
    @Builder.Default
    private Integer dailyGoalMinutes = 15;
}
