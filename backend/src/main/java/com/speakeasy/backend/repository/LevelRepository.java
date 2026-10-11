package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LevelRepository extends JpaRepository<Level, Long> {
    List<Level> findAllByOrderByXpRequiredAsc();
}
