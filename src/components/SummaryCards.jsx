import React from 'react';

export default function SummaryCards({ evaluation }) {
  const {
    remainingClasses,
    totalClasses,
    pastClasses,
    attendedPast,
    requiredClasses75,
    is75Achievable,
    safeBunks75,
    requiredClasses90,
    is90Achievable,
    safeBunks90,
    currentPercentage,
    maxAchievablePercentage
  } = evaluation;

  return (
    <div className="stats-grid">
      {/* 1. Remaining Classes */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">Remaining Classes</span>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            📅
          </div>
        </div>
        <div className="stat-value highlight-blue">
          {remainingClasses}
        </div>
        <div className="stat-foot">
          <span>Out of <strong>{totalClasses}</strong> semester classes ({pastClasses} conducted so far)</span>
        </div>
      </div>

      {/* 2. Classes to Stay Out of Danger Zone (75%) */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">Required For 75% Safe Zone</span>
          <div className="stat-icon" style={{ background: is75Achievable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: is75Achievable ? '#10b981' : '#ef4444' }}>
            🛡️
          </div>
        </div>
        <div className={`stat-value ${is75Achievable ? (requiredClasses75 === 0 ? 'highlight-green' : 'highlight-amber') : 'highlight-red'}`}>
          {is75Achievable ? (
            requiredClasses75 === 0 ? '0 (Achieved)' : `${requiredClasses75} of ${remainingClasses}`
          ) : (
            'Impossible'
          )}
        </div>
        <div className="stat-foot">
          {is75Achievable ? (
            <span>
              {safeBunks75 > 0 ? (
                <>Safe to miss up to <strong className="highlight-green">{safeBunks75}</strong> classes</>
              ) : (
                <>Must attend <strong className="highlight-amber">all {requiredClasses75}</strong> remaining classes</>
              )}
            </span>
          ) : (
            <span className="highlight-red">Max possible: {maxAchievablePercentage.toFixed(1)}%</span>
          )}
        </div>
      </div>

      {/* 3. Classes to Reach/Maintain 90% */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">Required For 90% Distinction</span>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            🌟
          </div>
        </div>
        <div className={`stat-value ${is90Achievable ? (requiredClasses90 === 0 ? 'highlight-green' : 'highlight-blue') : 'highlight-amber'}`}>
          {is90Achievable ? (
            requiredClasses90 === 0 ? '0 (Secured)' : `${requiredClasses90} of ${remainingClasses}`
          ) : (
            'Not Reachable'
          )}
        </div>
        <div className="stat-foot">
          {is90Achievable ? (
            <span>
              {safeBunks90 > 0 ? (
                <>Buffer: <strong className="highlight-green">{safeBunks90}</strong> free bunks above 90%</>
              ) : (
                <>Attend <strong className="highlight-blue">{requiredClasses90}</strong> more to enter 90% club</>
              )}
            </span>
          ) : (
            <span>Highest ceiling reachable is <strong>{maxAchievablePercentage.toFixed(1)}%</strong></span>
          )}
        </div>
      </div>

      {/* 4. Safe Bunks / Attendance Scorecard */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">Bunk Cushion & Standing</span>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            ⚖️
          </div>
        </div>
        <div className="stat-value highlight-green">
          {safeBunks75 > 0 ? `${safeBunks75} Bunks` : '0 Bunks'}
        </div>
        <div className="stat-foot">
          <span>Attended <strong>{attendedPast}</strong> of <strong>{pastClasses}</strong> past lectures</span>
        </div>
      </div>
    </div>
  );
}
