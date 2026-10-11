-- ==============================================================================
-- SpeakEasy Initial Seed Data
-- ==============================================================================

USE speakeasy_db;

-- Insert Levels
INSERT INTO levels (level_id, title, xp_required, description) VALUES
(1, 'Warm-up', 0, 'Read a sentence aloud with natural pacing and clarity.'),
(2, 'Describe', 200, 'Talk about a picture or a simple question for 30 seconds.'),
(3, 'One Minute', 500, 'Speak on a structured topic for a full sixty seconds without freezing.'),
(4, 'Mock HR', 1000, 'Answer standard interview questions with structured behavioral framing (STAR method).'),
(5, 'Group Talk', 2000, 'Respond assertively in simulated panel and group discussion pressure environments.')
ON DUPLICATE KEY UPDATE title=VALUES(title), xp_required=VALUES(xp_required);

-- Insert Badges
INSERT INTO badges (badge_id, name, rule_description) VALUES
(1, 'First Words', 'Complete your very first sentence practice session.'),
(2, 'Filler Slayer', 'Achieve fewer than 2 filler words per minute in a session.'),
(3, 'Consistency Champion', 'Maintain a consecutive 5-day speaking streak.'),
(4, 'Fear Conqueror', 'Drop your session anxiety rating by at least 2 points.'),
(5, 'Interview Ready', 'Score 85% or higher in a Mock HR interview simulation.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Interview Questions
INSERT INTO interview_questions (role, category, question_text) VALUES
('Software Engineer', 'Behavioral', 'Tell me about a challenging bug you encountered in a project and how you diagnosed and resolved it.'),
('Software Engineer', 'Technical', 'Can you explain the difference between synchronous and asynchronous execution to a non-technical stakeholder?'),
('Software Engineer', 'Behavioral', 'Describe a time when you had a disagreement with a team member over an implementation approach. How did you resolve it?'),
('Data Analyst', 'Technical', 'How do you explain a complex data insight or statistical metric to leadership who have no math background?'),
('Data Analyst', 'Behavioral', 'Describe a situation where the raw data you received was incomplete or messy. How did you handle it?'),
('Product Manager', 'Behavioral', 'How do you prioritize features when multiple stakeholders demand competing requirements with tight deadlines?'),
('General HR', 'Icebreaker', 'Tell me about yourself, your educational background, and what drives your passion in this field.'),
('General HR', 'Strength & Weakness', 'What is one area of improvement you are currently working on, and what concrete steps are you taking?'),
('General HR', 'Conflict', 'Tell me about a time you worked under intense pressure or a looming deadline. How did you manage stress?');
