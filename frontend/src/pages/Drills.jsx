import React, { useState, useEffect } from 'react';
import { drillApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { Toast } from '../components/Toast';
import confetti from 'canvas-confetti';
import { RotateCcw, Check, X, Sparkles, Volume2, Calendar, Award } from 'lucide-react';

export const Drills = () => {
  const { user, updateUserState } = useAuth();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAttempt, setUserAttempt] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchDueDrills();
  }, []);

  const fetchDueDrills = async () => {
    try {
      setLoading(true);
      const res = await drillApi.getDueDrills();
      setCards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = async (isCorrect) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      await drillApi.answerDrill(currentCard.cardId, isCorrect);

      if (isCorrect) {
        confetti({ particleCount: 30, spread: 50 });
        setToastMessage('+5 XP! Interval extended for spaced memory.');
        updateUserState({ xpTotal: (user.xpTotal || 0) + 5 });
      } else {
        setToastMessage('Reset to Day 1 review schedule.');
      }

      // Next card
      setShowAnswer(false);
      setUserAttempt('');
      if (currentIndex + 1 < cards.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Completed all due cards
        setCards([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <Spinner size={36} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your spaced mistake cards...</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="page-wrapper" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
          <RotateCcw size={13} /> 1-3-7 Spaced Repetition Schedule
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Mistake Drills</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Fix your own linguistic errors until they become natural, fluent habits.
        </p>
      </div>

      {cards.length > 0 && currentCard ? (
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          {/* Progress Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-purple">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> Interval: {currentCard.intervalDays} Day(s)
            </span>
          </div>

          {/* Flashcard Challenge */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            marginBottom: '1.75rem',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Original Error to Fix:
            </span>
            <h2 style={{ fontSize: '1.5rem', color: '#fecaca', marginTop: '0.5rem', marginBottom: 0 }}>
              "{currentCard.originalPhrase}"
            </h2>
          </div>

          {/* User Type/Think Input */}
          {!showAnswer ? (
            <div>
              <input
                type="text"
                value={userAttempt}
                onChange={(e) => setUserAttempt(e.target.value)}
                placeholder="Say aloud or type the corrected phrase here..."
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.05rem', marginBottom: '1.5rem' }}
              />

              <Button
                onClick={() => setShowAnswer(true)}
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
              >
                Reveal Correction & Check
              </Button>
            </div>
          ) : (
            <div>
              {/* Correct Answer Box */}
              <div style={{
                background: 'rgba(6, 214, 160, 0.08)',
                border: '1px solid rgba(6, 214, 160, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#06d6a0', fontWeight: 700, textTransform: 'uppercase' }}>
                  Correct Phrasing:
                </span>
                <h3 style={{ fontSize: '1.35rem', color: '#a7f3d0', marginTop: '0.4rem', marginBottom: '0.5rem' }}>
                  "{currentCard.correction}"
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                  {currentCard.explanation}
                </p>

                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => handleSpeak(currentCard.correction)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Volume2 size={15} /> Listen to Correction
                  </button>
                </div>
              </div>

              {/* Scoring Choice */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="danger"
                  icon={<X size={18} />}
                >
                  I Forgot (Reset to 1 Day)
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  variant="primary"
                  icon={<Check size={18} />}
                >
                  Got It Right! (+5 XP)
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty / Completed State */
        <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(6, 214, 160, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06d6a0',
            marginBottom: '1.25rem',
          }}>
            <Award size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>All Caught Up!</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
            You have reviewed all drill cards due for today. Keep practicing in the arena to discover new vocabulary and elevate your fluency.
          </p>
          <Button
            onClick={() => drillApi.generateDrills().then(fetchDueDrills)}
            variant="secondary"
          >
            Regenerate Drills from Past Mistakes
          </Button>
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} type="xp" onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};
