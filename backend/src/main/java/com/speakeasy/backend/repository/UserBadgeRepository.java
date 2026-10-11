package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUser_UserId(Long userId);
    boolean existsByUser_UserIdAndBadge_BadgeId(Long userId, Long badgeId);
}
