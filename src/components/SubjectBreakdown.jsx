import React from 'react';
import { evaluateAttendance } from '../utils/calculator.js';

export default function SubjectBreakdown({ subjectStats, subjectPercentages, onSubjectPercentageChange }) {
  return (
    <section className="subjects-container" aria-label="Subject Wise Attendance Breakdown">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '1.15rem', fontWeight: 700 }}>
            📚 Subject-Wise Attendance Breakdown & Recovery Plan
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Each subject has different credit weights and weekly lecture counts. Fine-tune your percentages below.
          </p>
        </div>
      </div>

      {subjectStats.map(sub => {
        const currentPct = subjectPercentages[sub.code] !== undefined ? subjectPercentages[sub.code] : 75;
        const evalSub = evaluateAttendance({
          currentPercentage: currentPct,
          pastClasses: sub.pastClasses,
          remainingClasses: sub.remainingClasses,
          totalClasses: sub.totalClasses
        });

        let statusBadgeColor = '#10b981';
        let statusBadgeText = 'Safe (75%+)';
        if (evalSub.status === 'IRREVERSIBLE_DETENTION') {
          statusBadgeColor = '#ef4444';
          statusBadgeText = 'Irreversible Detention';
        } else if (evalSub.status === 'DANGER_ZONE') {
          statusBadgeColor = '#f59e0b';
          statusBadgeText = 'Danger Zone';
        } else if (evalSub.status === 'DISTINCTION') {
          statusBadgeColor = '#8b5cf6';
          statusBadgeText = '90%+ Distinction';
        }

        return (
          <div key={sub.code} className="subject-row-card">
            {/* Subject Info */}
            <div className="sub-meta">
              <div className="sub-color-tag" style={{ background: sub.color || '#3b82f6' }}></div>
              <div className="sub-title-wrap">
                <h4>{sub.name}</h4>
                <div className="sub-submeta">
                  <span style={{ color: '#93c5fd', fontWeight: 600 }}>{sub.code}</span>
                  <span>·</span>
                  <span>Slot {sub.slot}</span>
                  <span>·</span>
                  <span>{sub.faculty}</span>
                  <span>·</span>
                  <span>{sub.weeklyClasses} hrs/wk</span>
                </div>
              </div>
            </div>

            {/* Attendance % Input */}
            <div className="sub-stat-col">
              <span className="sub-stat-lbl">Current Attendance</span>
              <div className="sub-input-wrap" style={{ marginTop: '4px' }}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  className="sub-pct-input"
                  value={currentPct}
                  onChange={(e) => onSubjectPercentageChange(sub.code, Number(e.target.value))}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>%</span>
              </div>
            </div>

            {/* Classes Left in Semester */}
            <div className="sub-stat-col">
              <span className="sub-stat-lbl">Classes Left</span>
              <span className="sub-stat-val highlight-blue">
                {sub.remainingClasses}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                of {sub.totalClasses} total ({sub.pastClasses} done)
              </span>
            </div>

            {/* Must Attend for 75% */}
            <div className="sub-stat-col">
              <span className="sub-stat-lbl">Must Attend for 75%</span>
              <span className={`sub-stat-val ${evalSub.is75Achievable ? (evalSub.requiredClasses75 === 0 ? 'highlight-green' : 'highlight-amber') : 'highlight-red'}`}>
                {evalSub.is75Achievable ? (
                  evalSub.requiredClasses75 === 0 ? '0 (Achieved)' : `${evalSub.requiredClasses75} classes`
                ) : (
                  'Impossible'
                )}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                {evalSub.is75Achievable ? `Safe to miss: ${evalSub.safeBunks75}` : `Max: ${evalSub.maxAchievablePercentage.toFixed(1)}%`}
              </span>
            </div>

            {/* For 90% Distinction */}
            <div className="sub-stat-col">
              <span className="sub-stat-lbl">For 90% Distinction</span>
              <span className={`sub-stat-val ${evalSub.is90Achievable ? (evalSub.requiredClasses90 === 0 ? 'highlight-green' : 'highlight-blue') : 'highlight-amber'}`}>
                {evalSub.is90Achievable ? (
                  evalSub.requiredClasses90 === 0 ? 'Secured' : `${evalSub.requiredClasses90} classes`
                ) : (
                  'Not Reachable'
                )}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                {evalSub.is90Achievable ? `Bunk buffer: ${evalSub.safeBunks90}` : 'Cap < 90%'}
              </span>
            </div>

            {/* Status Badge */}
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: `${statusBadgeColor}20`,
                  color: statusBadgeColor,
                  border: `1px solid ${statusBadgeColor}50`,
                  display: 'inline-block'
                }}
              >
                {statusBadgeText}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
