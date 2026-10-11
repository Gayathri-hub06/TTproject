import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { practiceApi, aiApi } from '../services/api';
import { Button } from '../components/Button';
import { ResultCard } from '../components/ResultCard';
import { HesitationHeatmap } from '../components/HesitationHeatmap';
import { BreathingCircle } from '../components/BreathingCircle';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  Mic,
  Square,
  Keyboard,
  Sparkles,
  Heart,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const Practice = () => {
  const { user, updateUserState } = useAuth();
  const [lang, setLang] = useState('en-IN');
  const [manualText, setManualText] = useState('');
  const [isTypingMode, setIsTypingMode] = useState(false);

  // Fear Meter Ratings (1 to 5)
  const [fearBefore, setFearBefore] = useState(3);
  const [fearAfter, setFearAfter] = useState(2);
  const [checkinSubmitted, setCheckinSubmitted] = useState(false);

  // Result state
  const [practiceResult, setPracticeResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // AI Coach modal
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [coachLoading, setCoachLoading] = useState(false);

  // Speech Recognition hook
  const {
    isListening,
    transcript,
    interimTranscript,
    supported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
    metrics,
  } = useSpeechRecognition(lang);

  const currentText = isTypingMode ? manualText : transcript;

  const handleStartStop = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleSubmit = async () => {
    const textToSend = currentText.trim();
    if (!textToSend) return;

    if (isListening) {
      stopListening();
    }

    try {
      setSubmitting(true);
      const payload = {
        text: textToSend,
        mode: isTypingMode ? 'TYPING' : 'SPEAKING',
        tone: 'PROFESSIONAL',
        wordsPerMinute: metrics.wordsPerMin,
        fillerCount: metrics.fillerCount,
        fillerBreakdown: JSON.stringify(metrics.fillerBreakdown),
        pauseCount: metrics.pauseCount,
        durationSec: metrics.durationSec,
        wordPauses: JSON.stringify(metrics.wordPauses),
      };

      const res = await practiceApi.submitSentence(payload);
      const data = res.data;
      setPracticeResult(data);
      setCheckinSubmitted(false);

      // Trigger Confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      // Update AuthContext user state
      updateUserState({
        xpTotal: data.newXpTotal,
        currentStreak: data.currentStreak,
        levelTitle: data.levelTitle,
      });

      setToastMessage(`+${data.xpEarned} XP Earned! ${data.leveledUp ? '🎉 Leveled Up to ' + data.levelTitle + '!' : ''}`);
    } catch (err) {
      console.error(err);
      alert('Unable to process sentence. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitCheckin = async () => {
    if (!practiceResult?.sessionId) return;
    try {
      await practiceApi.recordCheckin({
        sessionId: practiceResult.sessionId,
        fearBefore: Number(fearBefore),
        fearAfter: Number(fearAfter),
      });
      setCheckinSubmitted(true);
      setToastMessage('+3 XP Earned for Confidence Check-in!');
      updateUserState({
        xpTotal: (user.xpTotal || 0) + 3,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchCoach = async () => {
    setIsCoachOpen(true);
    try {
      setCoachLoading(true);
      const res = await aiApi.getCoachPrompt(fearBefore, user?.targetRole || 'Candidate', user?.levelTitle || 'Warm-up');
      setCoachData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Practice Arena</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Speak one sentence freely. SpeakEasy evaluates your cadence, eliminates fillers, and polishes your phrasing.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Dialect Selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.8125rem' }}
          >
            <option value="en-IN">English (India) · en-IN</option>
            <option value="en-US">English (US) · en-US</option>
            <option value="en-GB">English (UK) · en-GB</option>
          </select>

          {/* AI Fear Coach Button */}
          <Button
            onClick={handleFetchCoach}
            variant="secondary"
            icon={<Heart size={16} color="#f43f5e" />}
          >
            Fear Coach & Calming
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout (Wireframe Figure 3) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(300px, 1fr)',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Voice Capture & Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Pre-Session Fear Meter Slider */}
          <div className="fear-slider-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={15} color="#f43f5e" /> How nervous do you feel right now?
              </span>
              <span className={`badge ${fearBefore <= 2 ? 'badge-teal' : fearBefore === 3 ? 'badge-amber' : 'badge-red'}`}>
                {fearBefore === 1 ? '1 · Completely Calm' :
                 fearBefore === 2 ? '2 · Mild Butterflies' :
                 fearBefore === 3 ? '3 · Moderate Anxiety' :
                 fearBefore === 4 ? '4 · Highly Nervous' : '5 · Terrified'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={fearBefore}
              onChange={(e) => setFearBefore(Number(e.target.value))}
              className="fear-slider"
            />
          </div>

          {/* Speaking Console */}
          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {isTypingMode ? 'Type a sentence below:' : 'Press microphone to speak:'}
              </span>

              {/* Mode switch */}
              <button
                type="button"
                onClick={() => setIsTypingMode(!isTypingMode)}
                className="btn btn-secondary btn-sm"
              >
                {isTypingMode ? <Mic size={14} /> : <Keyboard size={14} />}
                {isTypingMode ? 'Switch to Voice' : 'Type Instead'}
              </button>
            </div>

            {/* Mic Button or Textarea */}
            {!isTypingMode ? (
              <div style={{ padding: '1.5rem 0' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    onClick={handleStartStop}
                    className={`btn ${isListening ? 'btn-danger mic-pulsing' : 'btn-primary'}`}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      padding: 0,
                      boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.6)' : '0 0 25px rgba(6, 214, 160, 0.4)',
                    }}
                  >
                    {isListening ? <Square size={32} /> : <Mic size={36} />}
                  </button>
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: isListening ? '#f87171' : 'var(--text-muted)' }}>
                  {isListening ? 'Listening... Speak your sentence aloud' : 'Tap microphone to speak'}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <textarea
                  rows={3}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="e.g. Myself Gayathri, I am having doubt in machine learning..."
                  className="form-textarea"
                  style={{ fontSize: '1rem', lineHeight: 1.5 }}
                />
              </div>
            )}

            {/* Live Transcript Display */}
            {!isTypingMode && (
              <div style={{
                background: 'rgba(10, 15, 29, 0.85)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                minHeight: '70px',
                textAlign: 'left',
                marginBottom: '1.25rem',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Browser Transcript
                </div>
                <div style={{ fontSize: '1rem', color: transcript ? '#f8fafc' : 'var(--text-dim)', fontStyle: transcript ? 'normal' : 'italic' }}>
                  {transcript || 'Spoken words appear here in real time...'}
                  {interimTranscript && (
                    <span style={{ color: 'var(--accent-cyan)', opacity: 0.8 }}> {interimTranscript}</span>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button
                onClick={resetTranscript}
                variant="secondary"
                disabled={!currentText || submitting}
              >
                Clear
              </Button>
              <Button
                onClick={handleSubmit}
                variant="primary"
                loading={submitting}
                disabled={!currentText.trim()}
                icon={<Zap size={18} />}
              >
                Analyze Sentence (+10 XP)
              </Button>
            </div>
          </div>

          {/* Hesitation Heatmap Visualizer (Feature 9) */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Hesitation Heatmap</span>
              <span className="badge badge-teal">Word-by-word pause detection</span>
            </div>
            <HesitationHeatmap wordPauses={metrics.wordPauses} />
          </div>

          {/* Results: Said -> Fixed -> Better (Features 2 & 17) */}
          {practiceResult && (
            <div className="glass-card" style={{ border: '1px solid rgba(6, 214, 160, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Sentence Analysis Result</h3>
                <span className="badge badge-teal">XP Awarded: +{practiceResult.xpEarned}</span>
              </div>

              {/* 1. Said */}
              <ResultCard
                type="said"
                title="1. What You Said"
                text={practiceResult.said}
              />

              {/* 2. Fixed */}
              <ResultCard
                type="fixed"
                title="2. Grammar Correction"
                text={practiceResult.fixed}
                description={
                  practiceResult.mistakes?.length > 0
                    ? `Fixed ${practiceResult.mistakes.length} pattern(s). Added to Spaced Repetition Drills!`
                    : 'Clean grammar structure!'
                }
              />

              {/* 3. Better */}
              <ResultCard
                type="better"
                title="3. Say It Better (Interview Ready)"
                text={practiceResult.better}
                description="Enhanced for executive presence and interview fluency."
                onRepeat={() => {
                  setToastMessage('+5 XP for repeating polished phrasing!');
                  updateUserState({ xpTotal: (user.xpTotal || 0) + 5 });
                }}
              />

              {/* Post-Session Fear Meter Rating */}
              <div style={{
                background: 'rgba(10, 15, 29, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                marginTop: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Heart size={15} color="#06d6a0" /> How nervous do you feel after speaking this sentence?
                  </span>
                  <span className={`badge ${fearAfter <= 2 ? 'badge-teal' : 'badge-amber'}`}>
                    Level {fearAfter}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={fearAfter}
                  onChange={(e) => setFearAfter(Number(e.target.value))}
                  className="fear-slider"
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                  <Button
                    onClick={handleSubmitCheckin}
                    variant="secondary"
                    size="sm"
                    disabled={checkinSubmitted}
                    icon={<CheckCircle size={14} color="#06d6a0" />}
                  >
                    {checkinSubmitted ? 'Confidence Rating Saved (+3 XP)' : 'Save Check-in (+3 XP)'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Fluency Analysis & AI Coach Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Real-time Fluency Metrics (Feature 5) */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={18} color="var(--accent-cyan)" /> Live Fluency Metrics
            </h3>

            {/* Pace */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Speaking Pace</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {metrics.wordsPerMin} WPM
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Ideal conversational pace: 120 – 160 WPM
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min((metrics.wordsPerMin / 200) * 100, 100)}%`,
                  background: metrics.wordsPerMin >= 120 && metrics.wordsPerMin <= 160 ? '#06d6a0' : '#38bdf8',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            {/* Filler Words */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Filler Words</span>
                <span className={`badge ${metrics.fillerCount <= 1 ? 'badge-teal' : metrics.fillerCount <= 3 ? 'badge-amber' : 'badge-red'}`}>
                  {metrics.fillerCount} fillers
                </span>
              </div>

              {/* Breakdown tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                {Object.keys(metrics.fillerBreakdown).length > 0 ? (
                  Object.entries(metrics.fillerBreakdown).map(([word, count]) => (
                    <span key={word} className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      "{word}": {count}x
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    No filler words detected
                  </span>
                )}
              </div>
            </div>

            {/* Pause count and speaking duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Freezes (&gt;1.2s)</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: metrics.pauseCount > 2 ? '#ef4444' : '#f8fafc' }}>
                  {metrics.pauseCount}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                  {metrics.durationSec}s
                </div>
              </div>
            </div>
          </div>

          {/* XP & Rewards Summary Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="var(--accent-teal)" /> Reward Rules Active
            </h3>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <li>Sentence Practised: <strong>+10 XP</strong></li>
              <li>Filler-Free Bonus (&lt;2/min): <strong>+5 XP</strong></li>
              <li>Repeat Better Phrasing: <strong>+5 XP</strong></li>
              <li>Pre/Post Fear Check-in: <strong>+3 XP</strong></li>
              <li>Active Streak Bonus: <strong>+{Math.min((user?.currentStreak || 1) * 2, 20)} XP</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI Fear-Adaptive Coach Modal (Feature 14) */}
      <Modal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        title="Fear-Adaptive AI Coach & Grounding"
      >
        {coachLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <BreathingCircle />
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Calibrating prompt to your anxiety level...</p>
          </div>
        ) : coachData ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className={`badge ${coachData.difficulty === 'GENTLE' ? 'badge-teal' : coachData.difficulty === 'MODERATE' ? 'badge-amber' : 'badge-purple'}`}>
                Difficulty: {coachData.difficulty}
              </span>
              <span className="badge badge-teal">Adaptive Exposure</span>
            </div>

            <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase' }}>
                Your Recommended Practice Prompt:
              </span>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.4rem', lineHeight: 1.5 }}>
                "{coachData.prompt}"
              </p>
            </div>

            {/* Calming Tip */}
            <div style={{ marginBottom: '1.5rem', background: 'rgba(56, 189, 248, 0.08)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Grounding Coach Tip:</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.25rem', margin: 0 }}>
                {coachData.calmingTip}
              </p>
            </div>

            {/* Animated Breathing Circle visualizer */}
            <BreathingCircle pattern={coachData.breathingCue} />
          </div>
        ) : (
          <BreathingCircle />
        )}
      </Modal>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="xp"
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};
