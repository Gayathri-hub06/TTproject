package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.XpEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XpEventRepository extends JpaRepository<XpEvent, Long> {
    List<XpEvent> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
}
