import React, { useState } from 'react';
import { Volume2, Copy, Check } from 'lucide-react';

export const ResultCard = ({
  type = 'said', // 'said' | 'fixed' | 'better'
  text = '',
  title = '',
  description = '',
  onRepeat = null,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const getStyleConfig = () => {
    switch (type) {
      case 'said':
        return {
          badge: 'You Said',
          badgeClass: 'badge-blue',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          bgColor: 'rgba(59, 130, 246, 0.05)',
        };
      case 'fixed':
        return {
          badge: 'Grammar Fix',
          badgeClass: 'badge-amber',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          bgColor: 'rgba(245, 158, 11, 0.05)',
        };
      case 'better':
        return {
          badge: 'Say It Better (Interview Ready)',
          badgeClass: 'badge-teal',
          borderColor: 'rgba(6, 214, 160, 0.4)',
          bgColor: 'rgba(6, 214, 160, 0.07)',
        };
      default:
        return {
          badge: 'Output',
          badgeClass: 'badge-blue',
          borderColor: 'var(--border-subtle)',
          bgColor: 'var(--bg-card)',
        };
    }
  };

  const config = getStyleConfig();

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: config.bgColor,
      border: `1px solid ${config.borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      marginBottom: '1rem',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}>
        <span className={`badge ${config.badgeClass}`}>{title || config.badge}</span>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={handleSpeak}
            title="Listen to pronunciation"
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.3rem 0.5rem',
              color: isPlaying ? 'var(--accent-teal)' : 'var(--text-muted)'
            }}
          >
            <Volume2 size={16} />
            {isPlaying ? 'Playing...' : 'Listen'}
          </button>

          <button
            onClick={handleCopy}
            title="Copy text"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.3rem 0.5rem', color: copied ? 'var(--accent-teal)' : 'var(--text-muted)' }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <p style={{
        fontSize: '1.05rem',
        fontWeight: type === 'better' ? 600 : 400,
        color: type === 'better' ? '#ffffff' : 'var(--text-main)',
        lineHeight: 1.6,
      }}>
        {text || 'No text captured.'}
      </p>

      {description && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {description}
        </p>
      )}

      {onRepeat && (
        <div style={{ marginTop: '0.85rem' }}>
          <button onClick={onRepeat} className="btn btn-outline btn-sm">
            Repeat this phrase (+5 XP)
          </button>
        </div>
      )}
    </div>
  );
};
