package com.speakeasy.backend.controller;

import com.speakeasy.backend.dto.ProfileUpdateRequest;
import com.speakeasy.backend.dto.UserDto;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.service.AuthService;
import com.speakeasy.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final AuthService authService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = authService.getCurrentUserDto(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        UserDto updated = profileService.updateProfile(user, request);
        return ResponseEntity.ok(updated);
    }
}
