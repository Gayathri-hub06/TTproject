package com.speakeasy.backend.controller;

import com.speakeasy.backend.dto.InterviewAttemptRequest;
import com.speakeasy.backend.dto.InterviewAttemptResponse;
import com.speakeasy.backend.dto.InterviewQuestionDto;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.service.AuthService;
import com.speakeasy.backend.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final AuthService authService;

    @GetMapping("/question")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<InterviewQuestionDto> getInterviewQuestion(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String category
    ) {
        InterviewQuestionDto q = interviewService.getRandomQuestion(role, category);
        return ResponseEntity.ok(q);
    }

    @PostMapping("/attempts")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<InterviewAttemptResponse> submitAttempt(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody InterviewAttemptRequest request
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        InterviewAttemptResponse response = interviewService.submitAttempt(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
