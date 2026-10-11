package com.speakeasy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mistakes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mistake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mistakeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private PracticeSession session;

    @Column(nullable = false, length = 50)
    private String mistakeType; // GRAMMAR, VOCABULARY, FILLER, PRONUNCIATION

    @Column(nullable = false, length = 255)
    private String originalPhrase;

    @Column(nullable = false, length = 255)
    private String correction;

    @Column(columnDefinition = "TEXT")
    private String explanation;
}
