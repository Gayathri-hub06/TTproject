package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.PracticeSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PracticeSessionRepository extends JpaRepository<PracticeSession, Long> {
    Page<PracticeSession> findByUser_UserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<PracticeSession> findByUser_UserId(Long userId);
    List<PracticeSession> findByUser_UserIdAndCreatedAtAfter(Long userId, LocalDateTime after);
    long countByUser_UserId(Long userId);

    @Query("SELECT AVG(sm.wordsPerMin) FROM SpeechMetrics sm WHERE sm.session.user.userId = :userId")
    Double getAvgWordsPerMinByUser(@Param("userId") Long userId);

    @Query("SELECT AVG(sm.fillerCount) FROM SpeechMetrics sm WHERE sm.session.user.userId = :userId")
    Double getAvgFillerCountByUser(@Param("userId") Long userId);
}
