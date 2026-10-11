package com.speakeasy.backend.controller;

import com.speakeasy.backend.dto.ClassDto;
import com.speakeasy.backend.dto.ClassStatsDto;
import com.speakeasy.backend.dto.CreateClassRequest;
import com.speakeasy.backend.dto.JoinClassRequest;
import com.speakeasy.backend.entity.Role;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.service.AuthService;
import com.speakeasy.backend.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;
    private final AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ClassDto> createClass(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateClassRequest request
    ) {
        User teacher = authService.getUserByEmail(userDetails.getUsername());
        ClassDto created = classService.createClass(teacher, request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<List<ClassDto>> getClasses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        if (user.getRole() == Role.TEACHER || user.getRole() == Role.ADMIN) {
            return ResponseEntity.ok(classService.getTeacherClasses(user.getUserId()));
        } else {
            return ResponseEntity.ok(classService.getJoinedClasses(user.getUserId()));
        }
    }

    @PostMapping("/join")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<ClassDto> joinClass(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JoinClassRequest request
    ) {
        User student = authService.getUserByEmail(userDetails.getUsername());
        ClassDto joined = classService.joinClass(student, request.getJoinCode());
        return ResponseEntity.ok(joined);
    }

    @GetMapping("/{id}/stats")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ClassStatsDto> getClassStats(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User teacher = authService.getUserByEmail(userDetails.getUsername());
        ClassStatsDto stats = classService.getClassStats(id, teacher.getUserId());
        return ResponseEntity.ok(stats);
    }
}
