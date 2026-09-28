import React, { useState, useMemo } from 'react';
import { calculateLeaveImpact, simulateLeaveAttendance } from '../utils/leaveCalculator.js';
import { SEMESTER_START_DATE, SEMESTER_END_DATE } from '../data/timetableData.js';

const LEAVE_TYPES = [
  { id: 'OD', label: 'On-Duty (OD)', icon: '🎓', color: '#3b82f6', desc: 'Official duty — typically counted as present' },
  { id: 'MEDICAL', label: 'Medical Leave', icon: '🏥', color: '#10b981', desc: 'Doctor-certified sick leave' },
  { id: 'CASUAL', label: 'Casual Leave', icon: '🌴', color: '#f59e0b', desc: 'Personal leave — counted as absent' },
];

export default function LeaveSimulator({ section, evaluation, distribution, asOfDate }) {
  const [leaveType, setLeaveType]   = useState('MEDICAL');
  const [startDate, setStartDate]   = useState(asOfDate);
  const [endDate, setEndDate]       = useState(asOfDate);
  const [affectAll, setAffectAll]   = useState(true);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const affectedCodes = affectAll ? null : (selectedSubs.length > 0 ? selectedSubs : null);

  const leaveImpact = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return null;
    return calculateLeaveImpact(section, startDate, endDate, affectedCodes);
  }, [section, startDate, endDate, affectedCodes]);

  const result = useMemo(() => {
    if (!leaveImpact) return null;
    return simulateLeaveAttendance(evaluation, distribution, leaveImpact);
  }, [leaveImpact, evaluation, distribution]);

  const toggleSub = (code) => {
    setSelectedSubs(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const selectedLeaveType = LEAVE_TYPES.find(l => l.id === leaveType);
  const isOD = leaveType === 'OD';

  return (
    <section className="leave-simulator-panel" aria-label="Leave & OD Simulator">
      <div className="section-head">
        <div>
          <h2 className="section-title">📋 OD / Leave Impact Simulator</h2>
          <p className="section-subtitle">
            Enter your leave dates to instantly see how your attendance is affected
          </p>
        </div>
      </div>

      {isOD && (
        <div className="od-notice">
          <span>ℹ️</span>
          <span>
            <strong>OD Note:</strong> On-Duty days are usually counted as "Present" by
            institutions. This simulator shows the <em>worst-case</em> scenario where OD
            is treated as absent. Check with your coordinator for actual policy.
          </span>
        </div>
      )}

      {/* Controls */}
      <div className="leave-controls-grid">
        {/* Leave Type */}
        <div className="leave-control-group">
          <label className="control-label">🏷️ Leave Type</label>
          <div className="leave-type-pills">
            {LEAVE_TYPES.map(lt => (
              <button
                key={lt.id}
                type="button"
                className={`leave-type-pill ${leaveType === lt.id ? 'active' : ''}`}
                style={leaveType === lt.id ? { borderColor: lt.color, background: `${lt.color}22`, color: lt.color } : {}}
                onClick={() => setLeaveType(lt.id)}
              >
                {lt.icon} {lt.label}
              </button>
            ))}
          </div>
          <span className="section-pill-tag">{selectedLeaveType?.desc}</span>
        </div>

        {/* Date range */}
        <div className="leave-control-group">
          <label className="control-label">📅 Leave Start Date</label>
          <input
            type="date"
            className="control-input"
            value={startDate}
            min={SEMESTER_START_DATE}
            max={SEMESTER_END_DATE}
            onChange={e => { setStartDate(e.target.value); if (e.target.value > endDate) setEndDate(e.target.value); }}
          />
        </div>
        <div className="leave-control-group">
          <label className="control-label">📅 Leave End Date</label>
          <input
            type="date"
            className="control-input"
            value={endDate}
            min={startDate}
            max={SEMESTER_END_DATE}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        {/* Subject scope */}
        <div className="leave-control-group">
          <label className="control-label">🎯 Apply To</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`btn ${affectAll ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
              onClick={() => setAffectAll(true)}
            >All Subjects</button>
            <button
              type="button"
              className={`btn ${!affectAll ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
              onClick={() => setAffectAll(false)}
            >Select Subjects</button>
          </div>
        </div>
      </div>

      {/* Subject checkboxes */}
      {!affectAll && (
        <div className="leave-subjects-picker">
          <div className="control-label" style={{ marginBottom: '12px' }}>
            Select affected subjects:
          </div>
          <div className="leave-subject-chips">
            {section.subjects.map(sub => (
              <button
                key={sub.code}
                type="button"
                className={`leave-sub-chip ${selectedSubs.includes(sub.code) ? 'active' : ''}`}
                style={selectedSubs.includes(sub.code) ? { borderColor: sub.color, background: `${sub.color}22`, color: sub.color } : {}}
                onClick={() => toggleSub(sub.code)}
              >
                <span className="chart-bar-dot" style={{ background: sub.color }} />
                {sub.code}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Simulate Button */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '12px 32px' }}
          onClick={() => setShowResult(true)}
          disabled={!leaveImpact}
        >
          ⚡ Calculate Impact
        </button>
        {showResult && (
          <button type="button" className="btn btn-outline"
            style={{ padding: '12px 20px' }}
            onClick={() => setShowResult(false)}>
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {showResult && result && (
        <div className="leave-result-panel">
          {/* Summary row */}
          <div className="leave-result-header">
            <div className="leave-result-stat">
              <span className="leave-result-num" style={{ color: '#ef4444' }}>
                {result.totalMissed}
              </span>
              <span className="leave-result-lbl">Classes Missed</span>
            </div>
            <div className="leave-result-stat">
              <span className="leave-result-num" style={{ color: result.is75AchievableAfterLeave ? '#10b981' : '#ef4444' }}>
                {result.newMaxPercentage.toFixed(1)}%
              </span>
              <span className="leave-result-lbl">Max After Leave</span>
            </div>
            <div className="leave-result-stat">
              <span className="leave-result-num" style={{ color: '#f59e0b' }}>
                -{result.percentageDrop.toFixed(1)}%
              </span>
              <span className="leave-result-lbl">Percentage Drop</span>
            </div>
            <div className="leave-result-stat">
              <span className="leave-result-num" style={{ color: result.is75AchievableAfterLeave ? '#10b981' : '#ef4444' }}>
                {result.is75AchievableAfterLeave ? '✅ SAFE' : '🚨 RISKY'}
              </span>
              <span className="leave-result-lbl">75% Status</span>
            </div>
          </div>

          {/* Risk alert */}
          {!result.is75AchievableAfterLeave && (
            <div className="leave-danger-alert">
              🚨 <strong>DETENTION RISK:</strong> After this leave, even attending all remaining classes
              gives you only <strong>{result.newMaxPercentage.toFixed(1)}%</strong> — below the 75% requirement!
              You need to attend at least <strong>{result.requiredAfterLeave}</strong> of the remaining{' '}
              <strong>{result.newRemainingClasses}</strong> classes.
            </div>
          )}

          {/* Subjects at risk */}
          {result.subjectsAtRisk.length > 0 && (
            <div className="leave-subjects-risk">
              <div className="leave-risk-title">⚠️ Subjects That Drop Below 75%:</div>
              {result.subjectsAtRisk.map(s => (
                <div key={s.code} className="leave-risk-row">
                  <span className="chart-bar-dot" style={{ background: s.color }} />
                  <span className="leave-risk-name">{s.name}</span>
                  <span className="leave-risk-pct">
                    {s.origMaxPercentage.toFixed(1)}% → <strong style={{ color: '#ef4444' }}>{s.newMaxPercentage.toFixed(1)}%</strong>
                    <span style={{ fontSize: '0.7rem', color: '#ef4444', marginLeft: '4px' }}>
                      (-{s.drop.toFixed(1)}%, {s.classesMissed} class{s.classesMissed !== 1 ? 'es' : ''} missed)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Day-by-day missed */}
          {result.missedDays.length > 0 && (
            <div className="leave-missed-days">
              <div className="leave-risk-title" style={{ marginBottom: '10px' }}>
                📅 Classes Missed on Leave Days:
              </div>
              <div className="leave-day-cards">
                {result.missedDays.map(d => (
                  <div key={d.date} className="leave-day-card">
                    <div className="leave-day-date">{d.date}</div>
                    <div className="leave-day-name">{d.day}</div>
                    <div className="leave-day-codes">
                      {d.subjectCodes.map(code => {
                        const sub = section.subjects.find(s => s.code === code);
                        return (
                          <span key={code} className="leave-day-sub-chip"
                            style={{ borderColor: sub?.color || '#64748b', color: sub?.color || '#94a3b8' }}>
                            {code}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.totalMissed === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#10b981', fontWeight: 600 }}>
              ✅ No classes are scheduled during this period — your leave has zero impact!
            </div>
          )}
        </div>
      )}
    </section>
  );
}
