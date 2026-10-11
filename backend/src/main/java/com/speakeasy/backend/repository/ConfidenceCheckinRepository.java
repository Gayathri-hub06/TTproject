package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.ConfidenceCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConfidenceCheckinRepository extends JpaRepository<ConfidenceCheckin, Long> {
    List<ConfidenceCheckin> findByUser_UserIdOrderByCreatedAtAsc(Long userId);
    List<ConfidenceCheckin> findTop10ByUser_UserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT AVG(c.fearBefore) - AVG(c.fearAfter) FROM ConfidenceCheckin c WHERE c.user.userId = :userId")
    Double getAvgFearReductionByUser(@Param("userId") Long userId);
}
