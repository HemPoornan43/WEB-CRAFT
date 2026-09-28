import React, { useState, useEffect } from 'react';

export default function WarningBanner({ evaluation }) {
  const { status, statusMessage, maxAchievablePercentage, is75Achievable, requiredClasses75, remainingClasses, currentPercentage } = evaluation;
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Audio tone generator for warning siren when irreversible detention occurs
  useEffect(() => {
    if (status === 'IRREVERSIBLE_DETENTION' && soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // AudioContext might require user gesture
      }
    }
  }, [status, soundEnabled]);

  let bannerClass = 'safe';
  let icon = '🛡️';
  let title = 'Attendance in Safe Zone';

  if (status === 'IRREVERSIBLE_DETENTION') {
    bannerClass = 'irreversible';
    icon = '🚨';
    title = 'CRITICAL ALERT: IRREVERSIBLE DETENTION!';
  } else if (status === 'DANGER_ZONE') {
    bannerClass = 'danger';
    icon = '⚠️';
    title = 'WARNING: IN DETENTION DANGER ZONE (< 75%)';
  } else if (status === 'WARNING_BORDERLINE') {
    bannerClass = 'danger';
    icon = '⚡';
    title = 'ATTENTION: BORDERLINE DETENTION RISK';
  } else if (status === 'DISTINCTION') {
    bannerClass = 'distinction';
    icon = '🌟';
    title = 'HONOR ROLL: 90%+ DISTINCTION ACHIEVED';
  }

  return (
    <div className={`warning-banner ${bannerClass}`}>
      <div className="warning-content">
        <div className="warning-icon">{icon}</div>
        <div>
          <div className="warning-title">{title}</div>
          <div className="warning-desc">
            {statusMessage}
          </div>
          {status === 'IRREVERSIBLE_DETENTION' && (
            <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#fecaca', fontWeight: 500 }}>
              Max Achievable Attendance: <strong style={{ color: '#fff' }}>{maxAchievablePercentage.toFixed(1)}%</strong> | 
              Classes Left in Semester: <strong style={{ color: '#fff' }}>{remainingClasses}</strong> | 
              Even with 100% future attendance, the mandatory 75% mark cannot be reached.
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <span className="warning-badge">
          {status === 'IRREVERSIBLE_DETENTION' ? 'DETENTION IMMINENT' : status.replace('_', ' ')}
        </span>

        {status === 'IRREVERSIBLE_DETENTION' && (
          <button 
            className="btn btn-outline" 
            style={{ fontSize: '0.72rem', padding: '4px 10px', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔔 Siren Sound ON' : '🔕 Siren Sound OFF'}
          </button>
        )}
      </div>
    </div>
  );
}
