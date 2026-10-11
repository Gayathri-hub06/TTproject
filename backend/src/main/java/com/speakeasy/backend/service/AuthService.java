package com.speakeasy.backend.service;

import com.speakeasy.backend.dto.*;
import com.speakeasy.backend.entity.*;
import com.speakeasy.backend.exception.DuplicateEmailException;
import com.speakeasy.backend.exception.ResourceNotFoundException;
import com.speakeasy.backend.repository.*;
import com.speakeasy.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final LevelRepository levelRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email " + request.getEmail() + " is already registered");
        }

        Level defaultLevel = levelRepository.findById(1L).orElse(null);

        Role userRole = request.getRole() != null ? request.getRole() : Role.USER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .xpTotal(0)
                .currentStreak(0)
                .level(defaultLevel)
                .build();

        user = userRepository.save(user);

        // Create default profile
        UserProfile profile = UserProfile.builder()
                .user(user)
                .displayName(user.getName())
                .targetRole(userRole == Role.TEACHER ? "Language Instructor" : "Software Engineer")
                .dailyGoalMinutes(15)
                .build();
        userProfileRepository.save(profile);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );

        String token = jwtService.generateToken(userDetails, user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .xpTotal(user.getXpTotal())
                .currentStreak(user.getCurrentStreak())
                .levelId(defaultLevel != null ? defaultLevel.getLevelId() : 1L)
                .levelTitle(defaultLevel != null ? defaultLevel.getTitle() : "Warm-up")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails, user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .xpTotal(user.getXpTotal())
                .currentStreak(user.getCurrentStreak())
                .levelId(user.getLevel() != null ? user.getLevel().getLevelId() : 1L)
                .levelTitle(user.getLevel() != null ? user.getLevel().getTitle() : "Warm-up")
                .build();
    }

    public UserDto getCurrentUserDto(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UserProfile profile = userProfileRepository.findByUser_UserId(user.getUserId()).orElse(null);

        // Determine next level XP
        Integer nextLevelXp = 200;
        List<Level> allLevels = levelRepository.findAllByOrderByXpRequiredAsc();
        if (user.getLevel() != null) {
            for (Level l : allLevels) {
                if (l.getXpRequired() > user.getXpTotal()) {
                    nextLevelXp = l.getXpRequired();
                    break;
                }
            }
        }

        return UserDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .xpTotal(user.getXpTotal())
                .currentStreak(user.getCurrentStreak())
                .levelId(user.getLevel() != null ? user.getLevel().getLevelId() : 1L)
                .levelTitle(user.getLevel() != null ? user.getLevel().getTitle() : "Warm-up")
                .nextLevelXp(nextLevelXp)
                .targetRole(profile != null ? profile.getTargetRole() : "Software Engineer")
                .dailyGoalMinutes(profile != null ? profile.getDailyGoalMinutes() : 15)
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
