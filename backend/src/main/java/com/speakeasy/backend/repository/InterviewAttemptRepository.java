package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.InterviewAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewAttemptRepository extends JpaRepository<InterviewAttempt, Long> {
    List<InterviewAttempt> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    long countByUser_UserId(Long userId);
}
