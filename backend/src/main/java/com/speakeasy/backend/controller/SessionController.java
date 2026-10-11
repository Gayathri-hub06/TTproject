package com.speakeasy.backend.controller;

import com.speakeasy.backend.dto.ConfidenceCheckinRequest;
import com.speakeasy.backend.dto.MistakeDto;
import com.speakeasy.backend.dto.SessionSummary;
import com.speakeasy.backend.entity.ConfidenceCheckin;
import com.speakeasy.backend.entity.PracticeSession;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.exception.ResourceNotFoundException;
import com.speakeasy.backend.repository.ConfidenceCheckinRepository;
import com.speakeasy.backend.repository.PracticeSessionRepository;
import com.speakeasy.backend.service.AuthService;
import com.speakeasy.backend.service.RewardEngine;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SessionController {

    private final PracticeSessionRepository sessionRepository;
    private final ConfidenceCheckinRepository checkinRepository;
    private final AuthService authService;
    private final RewardEngine rewardEngine;

    @GetMapping("/sessions")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getSessions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        Sort.Direction dir = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sort));

        Page<PracticeSession> sessionPage = sessionRepository.findByUser_UserIdOrderByCreatedAtDesc(user.getUserId(), pageable);

        var summaries = sessionPage.getContent().stream().map(s -> SessionSummary.builder()
                .sessionId(s.getSessionId())
                .createdAt(s.getCreatedAt())
                .mode(s.getMode())
                .tone(s.getTone())
                .originalText(s.getOriginalText())
                .correctedText(s.getCorrectedText())
                .improvedText(s.getImprovedText())
                .wordsPerMin(s.getMetrics() != null ? s.getMetrics().getWordsPerMin() : 0)
                .fillerCount(s.getMetrics() != null ? s.getMetrics().getFillerCount() : 0)
                .pauseCount(s.getMetrics() != null ? s.getMetrics().getPauseCount() : 0)
                .durationSec(s.getMetrics() != null ? s.getMetrics().getDurationSec() : 0)
                .wordPauses(s.getMetrics() != null ? s.getMetrics().getWordPauses() : "[]")
                .mistakeCount(s.getMistakes().size())
                .build()).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", summaries);
        response.put("currentPage", sessionPage.getNumber());
        response.put("totalElements", sessionPage.getTotalElements());
        response.put("totalPages", sessionPage.getTotalPages());
        response.put("size", sessionPage.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions/{id}")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getSessionDetail(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        PracticeSession s = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));

        if (!s.getUser().getUserId().equals(user.getUserId()) && !user.getRole().name().equals("ADMIN")) {
            throw new ResourceNotFoundException("Session not found with ID: " + id);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("sessionId", s.getSessionId());
        body.put("createdAt", s.getCreatedAt());
        body.put("mode", s.getMode());
        body.put("tone", s.getTone());
        body.put("originalText", s.getOriginalText());
        body.put("correctedText", s.getCorrectedText());
        body.put("improvedText", s.getImprovedText());
        body.put("metrics", s.getMetrics());
        body.put("mistakes", s.getMistakes().stream().map(m -> MistakeDto.builder()
                .mistakeId(m.getMistakeId())
                .mistakeType(m.getMistakeType())
                .originalPhrase(m.getOriginalPhrase())
                .correction(m.getCorrection())
                .explanation(m.getExplanation())
                .build()).collect(Collectors.toList()));

        return ResponseEntity.ok(body);
    }

    @DeleteMapping("/sessions/{id}")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    @Transactional
    public ResponseEntity<Void> deleteSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        PracticeSession s = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));

        if (!s.getUser().getUserId().equals(user.getUserId()) && !user.getRole().name().equals("ADMIN")) {
            throw new ResourceNotFoundException("Session not found with ID: " + id);
        }

        sessionRepository.delete(s);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkins")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    @Transactional
    public ResponseEntity<Map<String, Object>> recordCheckin(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ConfidenceCheckinRequest request
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        PracticeSession session = null;
        if (request.getSessionId() != null) {
            session = sessionRepository.findById(request.getSessionId()).orElse(null);
        }

        ConfidenceCheckin checkin = ConfidenceCheckin.builder()
                .user(user)
                .session(session)
                .fearBefore(request.getFearBefore())
                .fearAfter(request.getFearAfter())
                .build();
        checkinRepository.save(checkin);

        int points = rewardEngine.awardCheckinXp(user, request.getFearBefore(), request.getFearAfter());

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Confidence check-in saved");
        resp.put("fearBefore", request.getFearBefore());
        resp.put("fearAfter", request.getFearAfter());
        resp.put("xpEarned", points);

        return ResponseEntity.ok(resp);
    }
}
