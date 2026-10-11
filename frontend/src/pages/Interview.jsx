import React, { useState, useEffect } from 'react';
import { interviewApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Button } from '../components/Button';
import { CountdownRing } from '../components/CountdownRing';
import { Toast } from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  Users,
  Mic,
  Square,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
  Zap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const Interview = () => {
  const { user, updateUserState } = useAuth();
  const [role, setRole] = useState('Software Engineer');
  const [pressure, setPressure] = useState('FRIENDLY'); // FRIENDLY | NEUTRAL | TOUGH
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  // Timed answering state
  const [isRecording, setIsRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [manualAnswer, setManualAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Attempt Result
  const [attemptResult, setAttemptResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const {
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    metrics,
  } = useSpeechRecognition('en-IN');

  useEffect(() => {
    loadNewQuestion();
  }, [role]);

  // Countdown timer effect
  useEffect(() => {
    let timer = null;
    if (isRecording && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRecording) {
      handleStopAndSubmit();
    }
    return () => clearInterval(timer);
  }, [isRecording, secondsLeft]);

  const loadNewQuestion = async () => {
    try {
      setLoadingQuestion(true);
      setAttemptResult(null);
      resetTranscript();
      setManualAnswer('');
      setSecondsLeft(60);
      setIsRecording(false);
      const res = await interviewApi.getQuestion(role, '');
      setCurrentQuestion(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleStartRecording = () => {
    resetTranscript();
    setManualAnswer('');
    setSecondsLeft(60);
    setIsRecording(true);
    startListening();
  };

  const handleStopAndSubmit = async () => {
    setIsRecording(false);
    stopListening();

    const spoken = isTyping ? manualAnswer.trim() : transcript.trim();
    if (!spoken || !currentQuestion) return;

    try {
      setSubmitting(true);
      const res = await interviewApi.submitAttempt({
        questionId: currentQuestion.questionId,
        spokenAnswer: spoken,
        pressureLevel: pressure,
        durationSec: 60 - secondsLeft,
        wordsPerMin: metrics.wordsPerMin,
        fillerCount: metrics.fillerCount,
      });

      setAttemptResult(res.data);
      confetti({ particleCount: 60, spread: 70 });
      setToastMessage(`+${res.data.xpEarned} XP! Mock Interview Answer Evaluated.`);
      updateUserState({ xpTotal: (user.xpTotal || 0) + res.data.xpEarned });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '940px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
          <Users size={14} /> AI Interview Panel Simulator
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Mock Interview Arena</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Experience realistic 60-second behavioral & technical interview questions under graded pressure exposure.
        </p>
      </div>

      {/* Role & Pressure Selector Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        {/* Role */}
        <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
          <label className="form-label" style={{ marginBottom: '0.4rem' }}>Target Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
          >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Product Manager">Product Manager</option>
            <option value="General HR">General HR / Behavioral</option>
          </select>
        </div>

        {/* Pressure Level (Feature 16) */}
        <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
          <label className="form-label" style={{ marginBottom: '0.4rem' }}>Panel Pressure Level</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            {['FRIENDLY', 'NEUTRAL', 'TOUGH'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPressure(p)}
                className={`btn btn-sm ${pressure === p ? (p === 'TOUGH' ? 'btn-danger' : p === 'NEUTRAL' ? 'btn-secondary' : 'btn-primary') : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Card & 60s Ring */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-blue">{currentQuestion?.role || role}</span>
            <span className="badge badge-purple">{currentQuestion?.category || 'Interview'}</span>
          </div>

          <button
            onClick={loadNewQuestion}
            className="btn btn-secondary btn-sm"
          >
            Next Question &rarr;
          </button>
        </div>

        {/* Question Text */}
        <h2 style={{ fontSize: '1.45rem', lineHeight: 1.4, color: '#f8fafc', marginBottom: '1.5rem' }}>
          "{currentQuestion?.questionText || 'Loading question...'}"
        </h2>

        {/* Answering Controls with SVG Countdown Ring */}
        <div style={{
          background: 'rgba(10, 15, 29, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}>
          {/* Ring */}
          <CountdownRing secondsLeft={secondsLeft} totalSeconds={60} />

          {/* Transcript or Typing */}
          {!isTyping ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div style={{
                minHeight: '60px',
                background: 'rgba(17, 26, 48, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem',
                fontSize: '0.95rem',
                color: transcript ? '#f8fafc' : 'var(--text-dim)',
                textAlign: 'left',
                marginBottom: '1rem',
              }}>
                {transcript || (isRecording ? 'Listening... Speak your answer now' : 'Answer will appear here when microphone starts...')}
              </div>

              {!isRecording ? (
                <Button
                  onClick={handleStartRecording}
                  variant="primary"
                  size="lg"
                  icon={<Mic size={20} />}
                >
                  Start 60-Second Timed Answer
                </Button>
              ) : (
                <Button
                  onClick={handleStopAndSubmit}
                  variant="danger"
                  size="lg"
                  icon={<Square size={20} />}
                >
                  Finish Answering & Submit
                </Button>
              )}
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <textarea
                rows={4}
                value={manualAnswer}
                onChange={(e) => setManualAnswer(e.target.value)}
                placeholder="Type your interview answer here..."
                className="form-textarea"
                style={{ marginBottom: '1rem' }}
              />
              <Button
                onClick={handleStopAndSubmit}
                variant="primary"
                loading={submitting}
                style={{ width: '100%' }}
              >
                Submit Written Answer
              </Button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsTyping(!isTyping)}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            {isTyping ? 'Switch to Microphone' : 'Having microphone trouble? Type instead'}
          </button>
        </div>
      </div>

      {/* Attempt Feedback & Score Card */}
      {attemptResult && (
        <div className="glass-card" style={{ border: '1px solid rgba(6, 214, 160, 0.4)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Panel Evaluation Score</h3>
            <span className="badge badge-teal">Awarded +{attemptResult.xpEarned} XP</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'rgba(10, 15, 29, 0.8)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: attemptResult.score >= 80 ? 'rgba(6, 214, 160, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: attemptResult.score >= 80 ? '#06d6a0' : '#38bdf8',
            }}>
              {attemptResult.score}%
            </div>
            <div style={{ flex: 1 }}>
              <span className="badge badge-amber" style={{ marginBottom: '0.25rem' }}>
                Pressure Level: {attemptResult.pressureLevel}
              </span>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc', margin: 0, lineHeight: 1.5 }}>
                {attemptResult.feedback}
              </p>
            </div>
          </div>

          {/* Follow-up question probe */}
          {attemptResult.followUpQuestion && (
            <div style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                Follow-Up Probe by Interviewer:
              </span>
              <p style={{ fontSize: '1.05rem', color: '#bae6fd', fontWeight: 600, marginTop: '0.4rem', margin: 0 }}>
                "{attemptResult.followUpQuestion}"
              </p>
            </div>
          )}
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} type="xp" onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};
