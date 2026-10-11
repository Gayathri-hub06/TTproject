package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.InterviewQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByRole(String role);
    List<InterviewQuestion> findByRoleAndCategory(String role, String category);
    Page<InterviewQuestion> findByRoleContainingIgnoreCaseOrQuestionTextContainingIgnoreCase(String role, String text, Pageable pageable);
}
