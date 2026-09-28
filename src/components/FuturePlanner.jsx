import React, { useState } from 'react';
import { simulateFutureAttendance } from '../utils/calculator.js';

export default function FuturePlanner({ evaluation, asOfDate, futureDate, onFutureDateChange }) {
  const [willAttendCount, setWillAttendCount] = useState(evaluation.remainingClasses);

  // Sync slider default when remaining classes changes
  React.useEffect(() => {
    setWillAttendCount(evaluation.remainingClasses);
  }, [evaluation.remainingClasses]);

  const simulation = simulateFutureAttendance(evaluation, willAttendCount);

  const presets = [
    { label: 'Midterm Milestone', date: '2026-10-15' },
    { label: 'Festival Break', date: '2026-11-01' },
    { label: 'Semester End (Nov 29)', date: '2026-11-29' }
  ];

  return (
    <section className="simulator-panel" aria-label="Future Attendance Simulator">
      <div className="section-head">
        <div>
          <h2 className="section-title">
            <span>🔮 What-If Simulator & Future Date Planning</span>
          </h2>
          <p className="section-subtitle">
            Plan your attendance trajectory up to <strong>{futureDate}</strong> ({evaluation.remainingClasses} lectures scheduled)
          </p>
        </div>

        {/* Milestone Quick Presets */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {presets.map(p => (
            <button
              key={p.date}
              type="button"
              className={`btn ${futureDate === p.date ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={() => onFutureDateChange(p.date)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sim-grid">
        {/* Left: Interactive Slider */}
        <div className="sim-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Classes You Plan to Attend:
            </span>
            <span style={{ fontFamily: 'var(--mono-font)', fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8' }}>
              {willAttendCount} / {evaluation.remainingClasses}
            </span>
          </div>

          <div className="slider-wrapper">
            <input
              type="range"
              min="0"
              max={evaluation.remainingClasses}
              value={willAttendCount}
              onChange={(e) => setWillAttendCount(Number(e.target.value))}
              className="sim-slider"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <span>0% Attendance (Bunk All)</span>
            <span>Attend {Math.round(evaluation.remainingClasses / 2)} (50%)</span>
            <span>100% Attendance (Attend All)</span>
          </div>

          {/* Quick Buttons for What-If */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1, fontSize: '0.72rem', padding: '6px' }}
              onClick={() => setWillAttendCount(evaluation.remainingClasses)}
            >
              Attend 100%
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1, fontSize: '0.72rem', padding: '6px' }}
              onClick={() => setWillAttendCount(Math.min(evaluation.remainingClasses, evaluation.requiredClasses75))}
            >
              Attend Exactly for 75%
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1, fontSize: '0.72rem', padding: '6px' }}
              onClick={() => setWillAttendCount(Math.min(evaluation.remainingClasses, evaluation.requiredClasses90))}
            >
              Attend for 90%
            </button>
          </div>
        </div>

        {/* Right: Projected Outcome */}
        <div className="sim-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
              Projected Attendance at Selected Target Date
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
              <span style={{
                fontFamily: 'var(--heading-font)',
                fontSize: '2.4rem',
                fontWeight: 800,
                color: simulation.willBeDetained ? '#ef4444' : (simulation.willReachDistinction ? '#8b5cf6' : '#10b981')
              }}>
                {simulation.projectedPercentage.toFixed(1)}%
              </span>
              <span style={{ fontSize: '0.9rem', color: simulation.willBeDetained ? '#fca5a5' : '#86efac', fontWeight: 600 }}>
                {simulation.willBeDetained ? '🚨 DETENTION RISK' : (simulation.willReachDistinction ? '🌟 90%+ DISTINCTION' : '✅ SAFE STANDING')}
              </span>
            </div>
          </div>

          <div className="sim-stats-row">
            <div className="sim-stat-box">
              <div className="sim-stat-num highlight-blue">{simulation.projectedTotalAttended}</div>
              <div className="sim-stat-lbl">Total Attended</div>
            </div>
            <div className="sim-stat-box">
              <div className="sim-stat-num highlight-amber">{simulation.classesWillBunk}</div>
              <div className="sim-stat-lbl">Planned Bunks</div>
            </div>
            <div className="sim-stat-box">
              <div className="sim-stat-num highlight-green">
                {(simulation.projectedPercentage - evaluation.currentPercentage) >= 0 ? '+' : ''}
                {(simulation.projectedPercentage - evaluation.currentPercentage).toFixed(1)}%
              </div>
              <div className="sim-stat-lbl">Net Shift</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
