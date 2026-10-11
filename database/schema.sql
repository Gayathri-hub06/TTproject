-- ==============================================================================
-- SpeakEasy: A Fear-to-Fluency Speaking Coach for Students
-- Relational Database Schema (MySQL 8.0+)
-- Author: SpeakEasy Project
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS speakeasy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE speakeasy_db;

-- 1. LEVELS TABLE
CREATE TABLE IF NOT EXISTS levels (
    level_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    xp_required INT NOT NULL DEFAULT 0,
    description TEXT
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    xp_total INT NOT NULL DEFAULT 0,
    current_streak INT NOT NULL DEFAULT 0,
    last_active_date DATE NULL,
    level_id BIGINT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_level FOREIGN KEY (level_id) REFERENCES levels(level_id) ON DELETE SET NULL
);

-- 3. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    display_name VARCHAR(60),
    target_role VARCHAR(100) DEFAULT 'Software Engineer',
    daily_goal_minutes INT DEFAULT 15,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. PRACTICE SESSIONS TABLE
CREATE TABLE IF NOT EXISTS practice_sessions (
    session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    mode VARCHAR(30) DEFAULT 'SPEAKING',
    tone VARCHAR(30) DEFAULT 'PROFESSIONAL',
    original_text TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    improved_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_sessions_user_created ON practice_sessions(user_id, created_at DESC);

-- 5. MISTAKES TABLE
CREATE TABLE IF NOT EXISTS mistakes (
    mistake_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    mistake_type VARCHAR(50) NOT NULL,
    original_phrase VARCHAR(255) NOT NULL,
    correction VARCHAR(255) NOT NULL,
    explanation TEXT,
    CONSTRAINT fk_mistake_session FOREIGN KEY (session_id) REFERENCES practice_sessions(session_id) ON DELETE CASCADE
);

-- 6. SPEECH METRICS TABLE
CREATE TABLE IF NOT EXISTS speech_metrics (
    metric_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL UNIQUE,
    words_per_min INT NOT NULL DEFAULT 0,
    filler_count INT NOT NULL DEFAULT 0,
    filler_breakdown TEXT,
    pause_count INT NOT NULL DEFAULT 0,
    duration_sec INT NOT NULL DEFAULT 0,
    word_pauses TEXT,
    CONSTRAINT fk_metric_session FOREIGN KEY (session_id) REFERENCES practice_sessions(session_id) ON DELETE CASCADE
);

-- 7. CONFIDENCE CHECKINS TABLE
CREATE TABLE IF NOT EXISTS confidence_checkins (
    checkin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id BIGINT NULL,
    fear_before INT NOT NULL CHECK (fear_before BETWEEN 1 AND 5),
    fear_after INT NOT NULL CHECK (fear_after BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_checkin_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_checkin_session FOREIGN KEY (session_id) REFERENCES practice_sessions(session_id) ON DELETE SET NULL
);

-- 8. DRILL CARDS TABLE
CREATE TABLE IF NOT EXISTS drill_cards (
    card_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    mistake_id BIGINT NOT NULL,
    next_review_date DATE NOT NULL,
    interval_days INT NOT NULL DEFAULT 1,
    times_correct INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_drill_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_drill_mistake FOREIGN KEY (mistake_id) REFERENCES mistakes(mistake_id) ON DELETE CASCADE
);
CREATE INDEX idx_drill_user_next_review ON drill_cards(user_id, next_review_date);

-- 9. CLASSES TABLE (TEACHERS)
CREATE TABLE IF NOT EXISTS classes (
    class_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    join_code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_class_teacher FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 10. CLASS MEMBERS JOIN TABLE
CREATE TABLE IF NOT EXISTS class_members (
    class_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, user_id),
    CONSTRAINT fk_cm_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 11. INTERVIEW QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS interview_questions (
    question_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL
);

-- 12. INTERVIEW ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS interview_attempts (
    attempt_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    session_id BIGINT NULL,
    score INT NOT NULL DEFAULT 0,
    pressure_level VARCHAR(20) DEFAULT 'FRIENDLY',
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_question FOREIGN KEY (question_id) REFERENCES interview_questions(question_id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_session FOREIGN KEY (session_id) REFERENCES practice_sessions(session_id) ON DELETE SET NULL
);

-- 13. AI INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS ai_insights (
    insight_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL, -- PEP_TALK, DIAGNOSIS, WEEKLY_STORY
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_insight_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 14. XP EVENTS TABLE (AUDITABLE APPEND-ONLY LOG)
CREATE TABLE IF NOT EXISTS xp_events (
    event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    points INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_xp_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 15. BADGES TABLE
CREATE TABLE IF NOT EXISTS badges (
    badge_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE,
    rule_description TEXT NOT NULL
);

-- 16. USER BADGES ASSOCIATION TABLE
CREATE TABLE IF NOT EXISTS user_badges (
    user_badge_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badges(badge_id) ON DELETE CASCADE,
    CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);
