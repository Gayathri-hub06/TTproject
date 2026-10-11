package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.DrillCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DrillCardRepository extends JpaRepository<DrillCard, Long> {
    List<DrillCard> findByUser_UserIdAndNextReviewDateLessThanEqual(Long userId, LocalDate date);
    List<DrillCard> findByUser_UserId(Long userId);
    long countByUser_UserIdAndNextReviewDateLessThanEqual(Long userId, LocalDate date);
}
