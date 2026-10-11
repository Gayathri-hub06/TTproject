package com.speakeasy.backend.repository;

import com.speakeasy.backend.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    @Query("SELECT DISTINCT c FROM SchoolClass c LEFT JOIN FETCH c.teacher LEFT JOIN FETCH c.students WHERE c.teacher.userId = :teacherId")
    List<SchoolClass> findByTeacher_UserId(@Param("teacherId") Long teacherId);

    Optional<SchoolClass> findByJoinCode(String joinCode);

    @Query("SELECT DISTINCT c FROM SchoolClass c LEFT JOIN FETCH c.teacher LEFT JOIN FETCH c.students s WHERE s.userId = :studentId")
    List<SchoolClass> findClassesByStudentId(@Param("studentId") Long studentId);
}
