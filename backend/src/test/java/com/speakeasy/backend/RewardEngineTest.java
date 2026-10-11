package com.speakeasy.backend;

import com.speakeasy.backend.config.RewardProperties;
import com.speakeasy.backend.entity.Level;
import com.speakeasy.backend.entity.User;
import com.speakeasy.backend.repository.BadgeRepository;
import com.speakeasy.backend.repository.LevelRepository;
import com.speakeasy.backend.repository.UserBadgeRepository;
import com.speakeasy.backend.repository.UserRepository;
import com.speakeasy.backend.repository.XpEventRepository;
import com.speakeasy.backend.service.RewardEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RewardEngineTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private LevelRepository levelRepository;

    @Mock
    private XpEventRepository xpEventRepository;

    @Mock
    private BadgeRepository badgeRepository;

    @Mock
    private UserBadgeRepository userBadgeRepository;

    @Mock
    private RewardProperties rewardProperties;

    @InjectMocks
    private RewardEngine rewardEngine;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId(1L)
                .name("Test Student")
                .email("student@example.com")
                .xpTotal(100)
                .currentStreak(2)
                .lastActiveDate(LocalDate.now().minusDays(1))
                .build();
    }

    @Test
    void testAwardPracticeXp_IncreasesXpAndConsecutiveStreak() {
        when(rewardProperties.getSentenceXp()).thenReturn(10);
        when(rewardProperties.getStreakBonusPerDay()).thenReturn(2);
        when(rewardProperties.getStreakBonusCap()).thenReturn(20);
        when(rewardProperties.getFillerFreeBonus()).thenReturn(5);

        Level warmUp = Level.builder().levelId(1L).title("Warm-up").xpRequired(0).build();
        when(levelRepository.findAllByOrderByXpRequiredAsc()).thenReturn(List.of(warmUp));

        RewardEngine.RewardResult result = rewardEngine.awardPracticeXp(testUser, 130, 0, false);

        // Previous streak 2 + 1 consecutive day = 3
        assertEquals(3, result.streak());
        // Base 10 + Filler Free 5 + Streak bonus (3 * 2 = 6) = 21 points
        assertEquals(21, result.pointsEarned());
        assertEquals(121, result.newTotal());
        verify(userRepository).save(testUser);
    }

    @Test
    void testAwardDrillXp_AwardsCorrectDrillPoints() {
        when(rewardProperties.getDrillCorrectXp()).thenReturn(5);
        when(levelRepository.findAllByOrderByXpRequiredAsc()).thenReturn(List.of());

        int points = rewardEngine.awardDrillXp(testUser);

        assertEquals(5, points);
        assertEquals(105, testUser.getXpTotal());
        verify(userRepository).save(testUser);
    }
}
