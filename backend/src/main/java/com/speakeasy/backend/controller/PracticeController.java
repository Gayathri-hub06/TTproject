package com.speakeasy.backend.controller;

import com.speakeasy.backend.dto.PracticeRequest;
import com.speakeasy.backend.dto.PracticeResponse;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.service.AuthService;
import com.speakeasy.backend.service.PracticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final PracticeService practiceService;
    private final AuthService authService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<PracticeResponse> submitPracticeSentence(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PracticeRequest request
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        PracticeResponse response = practiceService.processSentence(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
