package com.speakeasy.backend.service;

import com.speakeasy.backend.dto.*;
import com.speakeasy.backend.entity.*;
import com.speakeasy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class PracticeService {

    private final PracticeSessionRepository sessionRepository;
    private final MistakeRepository mistakeRepository;
    private final SpeechMetricsRepository speechMetricsRepository;
    private final DrillCardRepository drillCardRepository;
    private final RewardEngine rewardEngine;

    @Transactional
    public PracticeResponse processSentence(User user, PracticeRequest request) {
        String original = request.getText().trim();

        // 1. Rule-based grammar analysis & enhancement
        AnalysisResult analysis = analyzeAndImprove(original, request.getTone());

        // 2. Persist PracticeSession
        PracticeSession session = PracticeSession.builder()
                .user(user)
                .mode(request.getMode() != null ? request.getMode() : "SPEAKING")
                .tone(request.getTone() != null ? request.getTone() : "PROFESSIONAL")
                .originalText(original)
                .correctedText(analysis.fixedText())
                .improvedText(analysis.betterText())
                .build();
        session = sessionRepository.save(session);

        // 3. Persist Mistakes & create initial Spaced Repetition Drill Cards (Day 1)
        List<MistakeDto> mistakeDtos = new ArrayList<>();
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        for (MistakeItem item : analysis.mistakes()) {
            Mistake mistake = Mistake.builder()
                    .session(session)
                    .mistakeType(item.type())
                    .originalPhrase(item.original())
                    .correction(item.correction())
                    .explanation(item.explanation())
                    .build();
            mistake = mistakeRepository.save(mistake);

            mistakeDtos.add(MistakeDto.builder()
                    .mistakeId(mistake.getMistakeId())
                    .mistakeType(mistake.getMistakeType())
                    .originalPhrase(mistake.getOriginalPhrase())
                    .correction(mistake.getCorrection())
                    .explanation(mistake.getExplanation())
                    .build());

            // Schedule Drill Card (1-3-7 day spaced repetition starting at 1 day)
            DrillCard drillCard = DrillCard.builder()
                    .user(user)
                    .mistake(mistake)
                    .nextReviewDate(tomorrow)
                    .intervalDays(1)
                    .timesCorrect(0)
                    .build();
            drillCardRepository.save(drillCard);
        }

        // 4. Persist SpeechMetrics
        SpeechMetrics metrics = SpeechMetrics.builder()
                .session(session)
                .wordsPerMin(request.getWordsPerMinute() != null ? request.getWordsPerMinute() : 0)
                .fillerCount(request.getFillerCount() != null ? request.getFillerCount() : 0)
                .fillerBreakdown(request.getFillerBreakdown())
                .pauseCount(request.getPauseCount() != null ? request.getPauseCount() : 0)
                .durationSec(request.getDurationSec() != null ? request.getDurationSec() : 0)
                .wordPauses(request.getWordPauses())
                .build();
        speechMetricsRepository.save(metrics);

        // 5. Award XP and update streak via RewardEngine
        int wpm = metrics.getWordsPerMin();
        int fillers = metrics.getFillerCount();
        boolean isImprovedRepeat = original.equalsIgnoreCase(session.getImprovedText());

        RewardEngine.RewardResult reward = rewardEngine.awardPracticeXp(user, wpm, fillers, isImprovedRepeat);

        // 6. Fluency Band classification
        String paceRating = classifyPace(wpm);
        String fillerRating = classifyFillers(fillers);

        return PracticeResponse.builder()
                .sessionId(session.getSessionId())
                .said(original)
                .fixed(analysis.fixedText())
                .better(analysis.betterText())
                .mistakes(mistakeDtos)
                .xpEarned(reward.pointsEarned())
                .newXpTotal(reward.newTotal())
                .currentStreak(reward.streak())
                .leveledUp(reward.leveledUp())
                .levelTitle(reward.levelTitle())
                .wordsPerMin(wpm)
                .fillerCount(fillers)
                .paceRating(paceRating)
                .fillerRating(fillerRating)
                .build();
    }

    private String classifyPace(int wpm) {
        if (wpm == 0) return "Not Measured";
        if (wpm < 100) return "Slow: hesitant rhythm";
        if (wpm < 120) return "Building: getting steadier";
        if (wpm <= 160) return "Ideal: natural conversation";
        return "Rushed: slow down slightly";
    }

    private String classifyFillers(int fillerCount) {
        if (fillerCount <= 2) return "Clean";
        if (fillerCount <= 5) return "Noticeable";
        return "Distracting: focus drills here";
    }

    private record MistakeItem(String type, String original, String correction, String explanation) {}
    private record AnalysisResult(String fixedText, String betterText, List<MistakeItem> mistakes) {}

    private AnalysisResult analyzeAndImprove(String input, String tone) {
        String fixed = input;
        List<MistakeItem> mistakes = new ArrayList<>();

        // Linguistic patterns common in ESL and Indian student English
        Map<String, ReplacementRule> rules = new LinkedHashMap<>();

        rules.put("(?i)\\bI am having (?:a )?doubt\\b", new ReplacementRule("I have a question", "GRAMMAR",
                "Use 'I have a question' instead of 'having doubt' in formal contexts."));

        rules.put("(?i)\\bmyself ([A-Za-z]+)\\b", new ReplacementRule("My name is $1", "VOCABULARY",
                "'Myself [Name]' is grammatically incorrect. Use 'My name is' or 'I am'."));

        rules.put("(?i)\\brevert back\\b", new ReplacementRule("reply", "VOCABULARY",
                "'Revert back' is redundant tautology. Simply say 'reply' or 'respond'."));

        rules.put("(?i)\\bpass out student\\b", new ReplacementRule("recent graduate", "VOCABULARY",
                "'Passed out' refers to fainting. Use 'graduated' or 'recent graduate'."));

        rules.put("(?i)\\bI am doing job in\\b", new ReplacementRule("I work at", "VOCABULARY",
                "Say 'I work at [Company]' rather than 'doing job in'."));

        rules.put("(?i)\\bdoes not knows\\b", new ReplacementRule("does not know", "GRAMMAR",
                "Auxiliary 'does' takes base verb form 'know'."));

        rules.put("(?i)\\bhe go\\b", new ReplacementRule("he goes", "GRAMMAR",
                "Subject-verb agreement: third-person singular takes 'goes'."));

        rules.put("(?i)\\bwe was\\b", new ReplacementRule("we were", "GRAMMAR",
                "Plural subject 'we' takes plural past 'were'."));

        rules.put("(?i)\\bvery good\\b", new ReplacementRule("exceptional", "VOCABULARY",
                "Elevate vocabulary: replace generic 'very good' with 'exceptional' or 'proficient'."));

        rules.put("(?i)\\btold to me\\b", new ReplacementRule("told me", "GRAMMAR",
                "'Told' takes a direct object without 'to'."));

        for (Map.Entry<String, ReplacementRule> entry : rules.entrySet()) {
            Pattern pattern = Pattern.compile(entry.getKey());
            Matcher matcher = pattern.matcher(fixed);
            if (matcher.find()) {
                String matched = matcher.group();
                String rep = entry.getValue().replacement;
                // If regex capture group used
                if (rep.contains("$1") && matcher.groupCount() >= 1) {
                    rep = rep.replace("$1", matcher.group(1));
                }
                fixed = matcher.replaceFirst(rep);
                mistakes.add(new MistakeItem(entry.getValue().type, matched, rep, entry.getValue().explanation));
            }
        }

        // Capitalize first letter and ensure ending punctuation
        if (!fixed.isEmpty()) {
            fixed = Character.toUpperCase(fixed.charAt(0)) + (fixed.length() > 1 ? fixed.substring(1) : "");
            if (!fixed.endsWith(".") && !fixed.endsWith("?") && !fixed.endsWith("!")) {
                fixed += ".";
            }
        }

        // Generate "Better" interview-ready version
        String better = buildBetterPhrasing(fixed, tone);

        return new AnalysisResult(fixed, better, mistakes);
    }

    private String buildBetterPhrasing(String sentence, String tone) {
        String trimmed = sentence.replaceAll("[.!?]$", "");

        // Pattern matching for professional interview elevation
        if (trimmed.toLowerCase().startsWith("i think")) {
            return "Based on my analysis, " + trimmed.substring(7).trim() + ", which aligns with our core objectives.";
        }
        if (trimmed.toLowerCase().startsWith("i want to say that")) {
            return "To elaborate further, " + trimmed.substring(18).trim() + ".";
        }
        if (trimmed.toLowerCase().startsWith("i worked on")) {
            return "I spearheaded the implementation of " + trimmed.substring(11).trim() + ", optimizing team efficiency.";
        }
        if (trimmed.toLowerCase().startsWith("i don't know")) {
            return "While I have not encountered this specific scenario yet, I would approach it by researching the documentation and verifying key edge cases.";
        }

        // Default interview polish
        return "In an interview setting: \"" + trimmed + ", which directly contributed to achieving our target outcomes.\"";
    }

    private record ReplacementRule(String replacement, String type, String explanation) {}
}
