package com.speakeasy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "speech_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpeechMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long metricId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private PracticeSession session;

    @Column(nullable = false)
    @Builder.Default
    private Integer wordsPerMin = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer fillerCount = 0;

    @Column(columnDefinition = "TEXT")
    private String fillerBreakdown; // JSON string e.g. {"um":2,"uh":1}

    @Column(nullable = false)
    @Builder.Default
    private Integer pauseCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer durationSec = 0;

    @Column(columnDefinition = "TEXT")
    private String wordPauses; // JSON string array of word pause objects
}
