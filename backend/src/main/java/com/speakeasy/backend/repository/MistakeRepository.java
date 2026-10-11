package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.Mistake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MistakeRepository extends JpaRepository<Mistake, Long> {
    List<Mistake> findBySession_SessionId(Long sessionId);
    List<Mistake> findBySession_User_UserId(Long userId);
}
