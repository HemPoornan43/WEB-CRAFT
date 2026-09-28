import React from 'react';

export default function Header({ selectedSection, onSectionChange, sections, asOfDate }) {
  return (
    <header className="top-nav">
      <div className="brand-wrapper">
        <div className="pixel-logo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
            <path d="m9 9.5 2 2 4-4"></path>
          </svg>
        </div>
        <div className="brand-info">
          <h1>THE ATTENDANCE PREDICTOR</h1>
          <span className="brand-badge">ROUND 1 · THE OVERWORLD · VIBECRAFT 2026</span>
        </div>
      </div>

      <div className="nav-actions">
        <div className="status-pill">
          <span className="pulse-dot"></span>
          <span>Semester: Aug 29 – Nov 29, 2026</span>
        </div>
      </div>
    </header>
  );
}
