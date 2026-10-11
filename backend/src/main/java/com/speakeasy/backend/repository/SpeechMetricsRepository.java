package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.SpeechMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpeechMetricsRepository extends JpaRepository<SpeechMetrics, Long> {
    Optional<SpeechMetrics> findBySession_SessionId(Long sessionId);
}
