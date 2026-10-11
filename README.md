# SpeakEasy · A Fear-to-Fluency Speaking Coach for Students

**SpeakEasy** is a web application designed to help students overcome speaking anxiety, master interview communication, and transition from classroom silence to professional fluency in a private, judgment-free environment.

---

---

## 🚀 Key Features Implemented (All 18 Features)
1. **Registration & Stateless JWT Authentication:** BCrypt password hashing, stateless token validation, role-based access control (`USER`, `TEACHER`, `ADMIN`).
2. **Practice a Sentence Loop:** Speech capture with Web Speech API (`en-IN` Indian English & `en-US`), text-to-speech audio playback (`window.speechSynthesis`), Said → Fixed → Better output.
3. **Reward Engine & Daily Streak:** Incremental XP scoring, consecutive streak tracking, streak bonus calculation, and audit trail in `xp_events`.
4. **Progress Dashboard:** Inline SVG Confidence Curve (Pre vs Post session fear), 7-day speaking habit tracker, pace/filler averages, achievement badges.
5. **Fluency Analysis:** Live speaking pace calculation (Words Per Minute), filler count & breakdown (`um`, `uh`, `like`, `you know`, `actually`), pause duration.
6. **Mock Interview Arena:** Timed 60-second answers with SVG countdown ring, STAR behavioral scoring, and dynamic follow-up questions.
7. **Level Ladder:** 5-tier roadmap (1: Warm-up → 2: Describe → 3: One Minute → 4: Mock HR → 5: Group Talk) with XP unlocks.
8. **Fear Meter:** Pre- and post-session anxiety slider (1–5 scale) tracking nervous-to-calm delta over time.
9. **Hesitation Heatmap:** Word-by-word pause detection with color grading (<0.5s Green, 0.5–1.5s Amber, >1.5s Red).
10. **Spaced Repetition Drills:** 1, 3, and 7-day review intervals automatically scheduled for learner's corrected errors.
11. **Teacher Role & Class Codes:** 6-character class codes (`SPK101`), privacy-preserving classroom aggregate analytics (student sentences remain strictly private).
12. **Admin Question Bank (CRUD):** Question repository management with pagination, modals, and dynamic XP weights tuner.
13. **Practice History:** Paginated session history with detail modal and delete confirmation modal.
14. **Fear-Adaptive AI Coach:** Anxiety-calibrated practice prompts, calming grounding tips, and animated CSS breathing visualizer.
15. **AI Hesitation Diagnosis:** Cadence analysis identifying micro-freeze spots, rhythm drills, and targeted tongue twisters.
16. **AI Interview Panel with Pressure Levels:** 3 graded exposure tiers (`FRIENDLY`, `NEUTRAL`, `TOUGH`).
17. **Say It in My Words:** Vocabulary rewriting calibrated one level above the learner's current baseline.
18. **Weekly Confidence Story:** Humanized progress narrative verified against exact database metrics without AI hallucination.

---

## 🛠️ Technology Stack
- **Frontend:** React 19 (Vite), React Router v7, Axios with interceptors, Lucide icons, Canvas Confetti, Web Speech API (SpeechRecognition & SpeechSynthesis).
- **Backend:** Java 21/25, Spring Boot 3.3.x (Spring Web, Spring Data JPA, Spring Security, Spring Validation, Lombok).
- **Authentication:** JJWT 0.12.5, BCryptPasswordEncoder, Method Security (`@PreAuthorize`).
- **Database:** MySQL 8.0+ (Schema DDL in `database/schema.sql`, Seed data in `database/seed.sql`) with in-memory H2 profile fallback.

---

## 👥 Getting Started

Create a user account through the registration page. For deployments, configure a stable JWT signing secret of at least 32 characters with the `SPEAKEASY_JWT_SECRET` environment variable. When it is unset, the backend generates a new signing secret at startup, so existing tokens will no longer be valid after a restart.

---

## 🏃 Running the Application Locally

### 1. Backend (Spring Boot REST API)
```bash
cd backend
# Run with MySQL default:
mvn spring-boot:run

# Or run with H2 in-memory profile:
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
Backend API will be accessible at `http://localhost:8080/api`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Application will be live at `http://localhost:5173`.
