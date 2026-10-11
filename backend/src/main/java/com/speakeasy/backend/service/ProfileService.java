package com.speakeasy.backend.service;

import com.speakeasy.backend.dto.ProfileUpdateRequest;
import com.speakeasy.backend.dto.UserDto;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.entity.UserProfile;
import com.speakeasy.backend.repository.UserProfileRepository;
import com.speakeasy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final AuthService authService;

    @Transactional
    public UserDto updateProfile(User user, ProfileUpdateRequest request) {
        UserProfile profile = profileRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> UserProfile.builder().user(user).build());

        if (request.getDisplayName() != null && !request.getDisplayName().isBlank()) {
            profile.setDisplayName(request.getDisplayName().trim());
            user.setName(request.getDisplayName().trim());
            userRepository.save(user);
        }
        if (request.getTargetRole() != null && !request.getTargetRole().isBlank()) {
            profile.setTargetRole(request.getTargetRole().trim());
        }
        if (request.getDailyGoalMinutes() != null) {
            profile.setDailyGoalMinutes(request.getDailyGoalMinutes());
        }

        profileRepository.save(profile);
        return authService.getCurrentUserDto(user.getEmail());
    }
}
