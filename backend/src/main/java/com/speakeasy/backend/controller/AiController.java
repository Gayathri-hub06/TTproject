package com.speakeasy.backend.controller;

import com.speakeasy.backend.dto.AiCoachRequest;
import com.speakeasy.backend.dto.AiCoachResponse;
import com.speakeasy.backend.dto.HesitationReportDto;
import com.speakeasy.backend.dto.WeeklyConfidenceStoryDto;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.service.AiService;
import com.speakeasy.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;
    private final AuthService authService;

    @PostMapping("/coach")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<AiCoachResponse> getCoach(@RequestBody AiCoachRequest request) {
        AiCoachResponse response = aiService.getFearAdaptiveCoach(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hesitation-report")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<HesitationReportDto> getHesitationReport(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        HesitationReportDto report = aiService.diagnoseHesitationPatterns(user);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/weekly-story")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<WeeklyConfidenceStoryDto> getWeeklyStory(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        WeeklyConfidenceStoryDto story = aiService.generateWeeklyStory(user);
        return ResponseEntity.ok(story);
    }

    @PostMapping("/say-it-in-my-words")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> sayItInMyWords(@RequestBody Map<String, String> payload) {
        String sentence = payload.getOrDefault("sentence", "");
        String tone = payload.getOrDefault("tone", "PROFESSIONAL");
        String level = payload.getOrDefault("level", "Warm-up");
        String rewritten = aiService.sayItInMyWords(sentence, tone, level);
        return ResponseEntity.ok(Map.of("original", sentence, "rewritten", rewritten));
    }
}
