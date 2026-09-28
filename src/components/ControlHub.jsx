import React from 'react';
import { SEMESTER_START_DATE, SEMESTER_END_DATE } from '../data/timetableData.js';

export default function ControlHub({
  sections,
  selectedSectionId,
  onSectionChange,
  asOfDate,
  onAsOfDateChange,
  futureDate,
  onFutureDateChange,
  overallPercentage,
  onPercentageChange,
  mode,
  onModeChange
}) {
  const selectedSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  return (
    <section className="control-hub" aria-label="Attendance Prediction Controls">
      {/* 1. Class Section Selector */}
      <div className="control-group">
        <label htmlFor="section-select" className="control-label">
          <span>🏫 Class Section ({sections.length} Timetables)</span>
        </label>
        <select
          id="section-select"
          className="control-select"
          value={selectedSectionId}
          onChange={(e) => onSectionChange(e.target.value)}
        >
          {sections.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.fullName} ({s.venue})
            </option>
          ))}
        </select>
        <span className="section-pill-tag">
          {selectedSection.department} · {selectedSection.semester} · Venue: {selectedSection.venue}
        </span>
      </div>

      {/* 2. Today's Date (Calculated / Configurable) */}
      <div className="control-group">
        <label htmlFor="as-of-date" className="control-label">
          <span>📅 Today's Date (As-Of)</span>
        </label>
        <input
          id="as-of-date"
          type="date"
          className="control-input"
          value={asOfDate}
          min={SEMESTER_START_DATE}
          max={futureDate || SEMESTER_END_DATE}
          onChange={(e) => onAsOfDateChange(e.target.value)}
        />
        <span className="section-pill-tag">
          Semester: Aug 29 – Nov 29, 2026
        </span>
      </div>

      {/* 3. Preferred Future Date for Planning */}
      <div className="control-group">
        <label htmlFor="future-date" className="control-label">
          <span>🎯 Preferred Future Date</span>
        </label>
        <input
          id="future-date"
          type="date"
          className="control-input"
          value={futureDate}
          min={asOfDate}
          max={SEMESTER_END_DATE}
          onChange={(e) => onFutureDateChange(e.target.value)}
        />
        <span className="section-pill-tag">
          {futureDate === SEMESTER_END_DATE ? 'Target: Semester Finale (Nov 29)' : 'Target: Milestone Planning'}
        </span>
      </div>

      {/* 4. Current Attendance Percentage */}
      <div className="control-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="current-percentage" className="control-label">
            <span>📊 Current Attendance %</span>
          </label>
          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
            {mode === 'quick' ? 'Quick Mode' : 'Subject Mode'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            id="current-percentage"
            type="number"
            min="0"
            max="100"
            step="0.5"
            className="control-input"
            value={overallPercentage}
            onChange={(e) => onPercentageChange(Number(e.target.value))}
            placeholder="e.g. 72"
          />
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '8px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            onClick={() => onModeChange(mode === 'quick' ? 'subjects' : 'quick')}
            title="Toggle between Overall % and Subject-by-Subject %"
          >
            {mode === 'quick' ? 'By Subject' : 'Overall %'}
          </button>
        </div>
        <span className="section-pill-tag">
          Enter value between 0% and 100%
        </span>
      </div>
    </section>
  );
}
