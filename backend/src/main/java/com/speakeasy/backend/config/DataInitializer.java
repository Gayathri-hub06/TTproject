package com.speakeasy.backend.config;

import com.speakeasy.backend.entity.*;
import com.speakeasy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final LevelRepository levelRepository;
    private final BadgeRepository badgeRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(String... args) {
        log.info("Initializing SpeakEasy seed data...");
        seedLevels();
        seedBadges();
        seedQuestions();
        log.info("SpeakEasy seed data initialization complete.");
    }

    private void seedLevels() {
        if (levelRepository.count() == 0) {
            List<Level> levels = Arrays.asList(
                    Level.builder().levelId(1L).title("Warm-up").xpRequired(0)
                            .description("Read a sentence aloud with natural pacing and clarity.").build(),
                    Level.builder().levelId(2L).title("Describe").xpRequired(200)
                            .description("Talk about a picture or a simple question for 30 seconds.").build(),
                    Level.builder().levelId(3L).title("One Minute").xpRequired(500)
                            .description("Speak on a structured topic for a full sixty seconds without freezing.").build(),
                    Level.builder().levelId(4L).title("Mock HR").xpRequired(1000)
                            .description("Answer standard interview questions with structured behavioral framing (STAR method).").build(),
                    Level.builder().levelId(5L).title("Group Talk").xpRequired(2000)
                            .description("Respond assertively in simulated panel and group discussion pressure environments.").build()
            );
            levelRepository.saveAll(levels);
            log.info("Seeded 5 progression levels.");
        }
    }

    private void seedBadges() {
        if (badgeRepository.count() == 0) {
            List<Badge> badges = Arrays.asList(
                    Badge.builder().name("First Words").ruleDescription("Complete your very first sentence practice session.").build(),
                    Badge.builder().name("Filler Slayer").ruleDescription("Achieve fewer than 2 filler words per minute in a session.").build(),
                    Badge.builder().name("Consistency Champion").ruleDescription("Maintain a consecutive 5-day speaking streak.").build(),
                    Badge.builder().name("Fear Conqueror").ruleDescription("Drop your session anxiety rating by at least 2 points.").build(),
                    Badge.builder().name("Interview Ready").ruleDescription("Score 85% or higher in a Mock HR interview simulation.").build()
            );
            badgeRepository.saveAll(badges);
            log.info("Seeded 5 achievement badges.");
        }
    }

    private void seedQuestions() {
        if (interviewQuestionRepository.count() == 0) {
            List<InterviewQuestion> questions = Arrays.asList(
                    InterviewQuestion.builder().role("Software Engineer").category("Behavioral")
                            .questionText("Tell me about a challenging bug you encountered in a project and how you diagnosed and resolved it.").build(),
                    InterviewQuestion.builder().role("Software Engineer").category("Technical")
                            .questionText("Can you explain the difference between synchronous and asynchronous execution to a non-technical stakeholder?").build(),
                    InterviewQuestion.builder().role("Software Engineer").category("Behavioral")
                            .questionText("Describe a time when you had a disagreement with a team member over an implementation approach. How did you resolve it?").build(),
                    InterviewQuestion.builder().role("Data Analyst").category("Technical")
                            .questionText("How do you explain a complex data insight or statistical metric to leadership who have no math background?").build(),
                    InterviewQuestion.builder().role("Data Analyst").category("Behavioral")
                            .questionText("Describe a situation where the raw data you received was incomplete or messy. How did you handle it?").build(),
                    InterviewQuestion.builder().role("Product Manager").category("Behavioral")
                            .questionText("How do you prioritize features when multiple stakeholders demand competing requirements with tight deadlines?").build(),
                    InterviewQuestion.builder().role("General HR").category("Icebreaker")
                            .questionText("Tell me about yourself, your educational background, and what drives your passion in this field.").build(),
                    InterviewQuestion.builder().role("General HR").category("Strength & Weakness")
                            .questionText("What is one area of improvement you are currently working on, and what concrete steps are you taking?").build(),
                    InterviewQuestion.builder().role("General HR").category("Conflict")
                            .questionText("Tell me about a time you worked under intense pressure or a looming deadline. How did you manage stress?").build()
            );
            interviewQuestionRepository.saveAll(questions);
            log.info("Seeded 9 interview questions.");
        }
    }
}
