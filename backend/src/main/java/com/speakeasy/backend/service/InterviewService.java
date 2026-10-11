package com.speakeasy.backend.service;

import com.speakeasy.backend.dto.*;
import com.speakeasy.backend.entity.*;
import com.speakeasy.backend.exception.ResourceNotFoundException;
import com.speakeasy.backend.repository.InterviewAttemptRepository;
import com.speakeasy.backend.repository.InterviewQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewService {

    private final InterviewQuestionRepository questionRepository;
    private final InterviewAttemptRepository attemptRepository;
    private final RewardEngine rewardEngine;
    private final Random random = new Random();

    public InterviewQuestionDto getRandomQuestion(String role, String category) {
        List<InterviewQuestion> list;
        if (role != null && !role.isBlank() && category != null && !category.isBlank()) {
            list = questionRepository.findByRoleAndCategory(role, category);
        } else if (role != null && !role.isBlank()) {
            list = questionRepository.findByRole(role);
        } else {
            list = questionRepository.findAll();
        }

        if (list.isEmpty()) {
            list = questionRepository.findAll();
        }

        if (list.isEmpty()) {
            throw new ResourceNotFoundException("No interview questions available");
        }

        InterviewQuestion q = list.get(random.nextInt(list.size()));
        return InterviewQuestionDto.builder()
                .questionId(q.getQuestionId())
                .role(q.getRole())
                .category(q.getCategory())
                .questionText(q.getQuestionText())
                .build();
    }

    @Transactional
    public InterviewAttemptResponse submitAttempt(User user, InterviewAttemptRequest request) {
        InterviewQuestion question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + request.getQuestionId()));

        String answer = request.getSpokenAnswer() != null ? request.getSpokenAnswer().trim() : "";
        int wordCount = answer.isEmpty() ? 0 : answer.split("\\s+").length;

        // Structured Scoring algorithm based on answer depth, behavioral structure, and pressure
        int baseScore = 60;
        if (wordCount >= 20) baseScore += 10;
        if (wordCount >= 50) baseScore += 10;
        if (wordCount >= 90) baseScore += 10;

        // Behavioral markers check (STAR method keywords)
        String lower = answer.toLowerCase();
        boolean hasSituation = lower.contains("when") || lower.contains("project") || lower.contains("situation");
        boolean hasAction = lower.contains("i decided") || lower.contains("i implemented") || lower.contains("my role") || lower.contains("i used");
        boolean hasResult = lower.contains("result") || lower.contains("outcome") || lower.contains("improved") || lower.contains("finally");

        if (hasSituation) baseScore += 3;
        if (hasAction) baseScore += 4;
        if (hasResult) baseScore += 3;

        int finalScore = Math.min(Math.max(baseScore, 40), 98);

        // Feedback & follow-up probe based on pressure level
        String pressure = request.getPressureLevel() != null ? request.getPressureLevel() : "FRIENDLY";
        String feedback;
        String followUp;

        if ("TOUGH".equalsIgnoreCase(pressure)) {
            feedback = "Panel Analysis (Tough Mode): Your core explanation was identified. However, under cross-examination, you should articulate measurable quantitative metrics earlier. Pacing maintained under scrutiny.";
            followUp = "Could you walk us through the specific technical metrics or trade-offs you considered before finalizing that decision?";
        } else if ("NEUTRAL".equalsIgnoreCase(pressure)) {
            feedback = "Panel Analysis (Neutral Mode): Clear and professional structure. Consider closing your answer with a stronger conclusion statement emphasizing lesson learned.";
            followUp = "How did that experience shape how you approach similar technical roadblocks today?";
        } else {
            feedback = "Panel Analysis (Friendly Mode): Excellent warmth, natural cadence, and approachable delivery! You communicated your viewpoint with solid confidence.";
            followUp = "That sounds fascinating! What part of that project did you find most rewarding?";
        }

        InterviewAttempt attempt = InterviewAttempt.builder()
                .user(user)
                .question(question)
                .score(finalScore)
                .pressureLevel(pressure)
                .feedback(feedback)
                .build();
        attempt = attemptRepository.save(attempt);

        int xp = rewardEngine.awardInterviewXp(user, finalScore);

        return InterviewAttemptResponse.builder()
                .attemptId(attempt.getAttemptId())
                .questionId(question.getQuestionId())
                .score(finalScore)
                .feedback(feedback)
                .followUpQuestion(followUp)
                .xpEarned(xp)
                .pressureLevel(pressure)
                .build();
    }
}
