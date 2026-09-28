import React from 'react';

export default function DonutGauge({ percentage, status, maxAchievable }) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  let strokeColor = '#10b981'; // Green
  if (status === 'IRREVERSIBLE_DETENTION') strokeColor = '#ef4444'; // Red
  else if (clampedPct < 75) strokeColor = '#f59e0b'; // Amber
  else if (clampedPct >= 90) strokeColor = '#8b5cf6'; // Violet / Distinction
  else strokeColor = '#3b82f6'; // Blue

  return (
    <div className="gauge-card">
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Current Attendance
      </div>

      <div className="gauge-svg-wrapper">
        <svg className="gauge-svg" viewBox="0 0 200 200">
          <circle
            className="gauge-bg"
            cx="100"
            cy="100"
            r={radius}
          />
          <circle
            className="gauge-bar"
            cx="100"
            cy="100"
            r={radius}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="gauge-center-text">
          <span className="gauge-val" style={{ color: strokeColor }}>
            {clampedPct.toFixed(1)}%
          </span>
          <span className="gauge-label">
            {clampedPct >= 75 ? (clampedPct >= 90 ? 'Distinction' : 'Safe Zone') : 'Detention Zone'}
          </span>
        </div>
      </div>

      <div className="gauge-subtext">
        {status === 'IRREVERSIBLE_DETENTION' ? (
          <span style={{ color: '#ef4444', fontWeight: 600 }}>
            Ceiling capped at {maxAchievable.toFixed(1)}%
          </span>
        ) : (
          <span>
            Goal: <strong style={{ color: '#f1f5f9' }}>75%</strong> min | <strong style={{ color: '#f1f5f9' }}>90%</strong> target
          </span>
        )}
      </div>
    </div>
  );
}
