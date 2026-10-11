package com.speakeasy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "drill_cards", indexes = {
    @Index(name = "idx_drill_user_next_review", columnList = "user_id, next_review_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrillCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mistake_id", nullable = false)
    private Mistake mistake;

    @Column(nullable = false)
    private LocalDate nextReviewDate;

    @Column(nullable = false)
    @Builder.Default
    private Integer intervalDays = 1; // 1 -> 3 -> 7

    @Column(nullable = false)
    @Builder.Default
    private Integer timesCorrect = 0;
}
