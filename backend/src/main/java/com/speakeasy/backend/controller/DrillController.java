package com.speakeasy.backend.controller;

import com.speakeasy.backend.dto.DrillAnswerRequest;
import com.speakeasy.backend.dto.DrillCardDto;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.service.AuthService;
import com.speakeasy.backend.service.DrillScheduler;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drills")
@RequiredArgsConstructor
public class DrillController {

    private final DrillScheduler drillScheduler;
    private final AuthService authService;

    @GetMapping("/due")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<List<DrillCardDto>> getDueDrills(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        List<DrillCardDto> cards = drillScheduler.getDueCards(user.getUserId());
        return ResponseEntity.ok(cards);
    }

    @PutMapping("/{id}/answer")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<DrillCardDto> submitDrillAnswer(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody DrillAnswerRequest request
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        DrillCardDto updated = drillScheduler.recordAnswer(id, user.getUserId(), request.getIsCorrect());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('USER', 'TEACHER', 'ADMIN')")
    public ResponseEntity<List<DrillCardDto>> generateDrills(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        List<DrillCardDto> generated = drillScheduler.generatePracticeDrills(user.getUserId());
        return ResponseEntity.ok(generated);
    }
}
