package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.AiInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiInsightRepository extends JpaRepository<AiInsight, Long> {
    List<AiInsight> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    Optional<AiInsight> findTopByUser_UserIdAndTypeOrderByCreatedAtDesc(Long userId, String type);
}
