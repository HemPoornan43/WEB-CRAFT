import React, { useState, useMemo } from 'react';
import { CLASS_SECTIONS, DEFAULT_TODAY_DATE, SEMESTER_END_DATE } from './data/timetableData.js';
import { getSectionClassDistribution, evaluateAttendance } from './utils/calculator.js';

// Auth
import LoginPage from './components/LoginPage.jsx';

// Phase 1 components
import ControlHub from './components/ControlHub.jsx';
import DonutGauge from './components/DonutGauge.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import WarningBanner from './components/WarningBanner.jsx';
import FuturePlanner from './components/FuturePlanner.jsx';
import SubjectBreakdown from './components/SubjectBreakdown.jsx';
import TimetableSchedule from './components/TimetableSchedule.jsx';
import Header from './components/Header.jsx';

// Phase 2 components
import AttendanceCharts from './components/AttendanceCharts.jsx';
import LeaveSimulator from './components/LeaveSimulator.jsx';
import AttendanceAdvisor from './components/AttendanceAdvisor.jsx';

// Compute overall % from DB attendance rows
function computeOverallFromDB(attendanceRows) {
  if (!attendanceRows || attendanceRows.length === 0) return 75;
  const totalAttended = attendanceRows.reduce((s, r) => s + (r.attended || 0), 0);
  const totalClasses  = attendanceRows.reduce((s, r) => s + (r.total    || 0), 0);
  return totalClasses > 0
    ? parseFloat(((totalAttended / totalClasses) * 100).toFixed(2))
    : 75;
}

// Build per-subject % map from DB rows
function buildSubjectPercentages(attendanceRows, defaultPct = 75) {
  const map = {};
  if (!attendanceRows) return map;
  attendanceRows.forEach(row => {
    if (row.subject_code && row.total > 0) {
      map[row.subject_code] = parseFloat(((row.attended / row.total) * 100).toFixed(2));
    }
  });
  return map;
}

export default function App() {
  // ── Auth state ──
  const [student, setStudent]           = useState(null);
  const [dbAttendance, setDbAttendance] = useState([]);

  // ── Dashboard state ──
  const [selectedSectionId, setSelectedSectionId] = useState(CLASS_SECTIONS[0].id);
  const [asOfDate, setAsOfDate]         = useState(DEFAULT_TODAY_DATE);
  const [futureDate, setFutureDate]     = useState(SEMESTER_END_DATE);
  const [overallPercentage, setOverallPercentage] = useState(75);
  const [mode, setMode]                 = useState('quick');
  const [activeTab, setActiveTab]       = useState('overview');

  // Per-subject attendance % (keyed by subject code)
  const [subjectPercentages, setSubjectPercentages] = useState({});

  // ── Dashboard derived state (ALWAYS called unconditionally before any early returns) ──
  const selectedSection = useMemo(
    () => CLASS_SECTIONS.find(s => s.id === selectedSectionId) || CLASS_SECTIONS[0],
    [selectedSectionId]
  );

  const distribution = useMemo(
    () => getSectionClassDistribution(selectedSection, asOfDate, futureDate),
    [selectedSection, asOfDate, futureDate]
  );

  const evaluation = useMemo(
    () => evaluateAttendance({
      currentPercentage: overallPercentage,
      pastClasses:       distribution.overallPast,
      remainingClasses:  distribution.overallRemaining,
      totalClasses:      distribution.overallTotal,
    }),
    [overallPercentage, distribution]
  );

  // ── Login handler ──
  const handleLogin = (studentData, attendanceRows) => {
    if (!studentData) return;
    setStudent(studentData);
    setDbAttendance(attendanceRows || []);

    // Auto-select section
    if (studentData.section_id) {
      const matched = CLASS_SECTIONS.find(s => s.id === studentData.section_id);
      if (matched) setSelectedSectionId(matched.id);
    }

    // Auto-compute overall % from DB
    const overall = computeOverallFromDB(attendanceRows);
    setOverallPercentage(overall);

    // Build per-subject % map from DB rows
    const perSubject = buildSubjectPercentages(attendanceRows, overall);
    setSubjectPercentages(perSubject);
  };

  const handleLogout = () => {
    setStudent(null);
    setDbAttendance([]);
    setOverallPercentage(75);
    setSubjectPercentages({});
    setSelectedSectionId(CLASS_SECTIONS[0].id);
    setActiveTab('overview');
  };

  const handleSubjectPercentageChange = (code, value) => {
    setSubjectPercentages(prev => ({ ...prev, [code]: value }));
  };

  // ── Show login if not authenticated ──
  if (!student) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'overview',  label: '📊 Overview'  },
    { id: 'charts',    label: '📈 Charts'    },
    { id: 'leave',     label: '📋 OD / Leave'},
    { id: 'subjects',  label: '📚 Subjects'  },
    { id: 'timetable', label: '🗓️ Timetable' },
  ];

  return (
    <div className="app-container">
      {/* ── Header with student pill + logout ── */}
      <header className="top-nav">
        <div className="brand-wrapper">
          <div className="pixel-logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="m9 9.5 2 2 4-4"/>
            </svg>
          </div>
          <div className="brand-info">
            <h1>THE ATTENDANCE PREDICTOR</h1>
            <span className="brand-badge">ROUND 1 · THE OVERWORLD · VIBECRAFT 2026</span>
          </div>
        </div>

        <div className="nav-actions">
          <div className="student-info-pill">
            <span className="student-avatar">👤</span>
            <div className="student-pill-text">
              <span className="student-pill-name">{student.name}</span>
              <span className="student-pill-reg">{student.register_no}</span>
            </div>
          </div>

          <div className="status-pill">
            <span className="pulse-dot"/>
            <span>Semester: Aug 29 – Nov 29, 2026</span>
          </div>

          <button
            className="btn btn-outline logout-btn"
            onClick={handleLogout}
            id="logout-btn"
            style={{ fontSize: '0.78rem', padding: '8px 14px' }}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* DB data banner */}
      {dbAttendance.length > 0 && (
        <div className="db-data-banner">
          <span>📡 Attendance loaded from database</span>
          <span className="db-data-reg">📋 {student.register_no}</span>
          <span className="db-data-pct">Overall: <strong>{overallPercentage}%</strong></span>
          <span className="db-data-count">
            {dbAttendance.length} subject{dbAttendance.length !== 1 ? 's' : ''} tracked
          </span>
        </div>
      )}

      {/* Control Hub */}
      <ControlHub
        sections={CLASS_SECTIONS}
        selectedSectionId={selectedSectionId}
        onSectionChange={setSelectedSectionId}
        asOfDate={asOfDate}
        onAsOfDateChange={setAsOfDate}
        futureDate={futureDate}
        onFutureDateChange={setFutureDate}
        overallPercentage={overallPercentage}
        onPercentageChange={setOverallPercentage}
        mode={mode}
        onModeChange={setMode}
      />

      {/* Warning Banner */}
      <WarningBanner evaluation={evaluation} />

      {/* Tabs */}
      <nav className="tabs-nav" aria-label="Dashboard sections">
        {tabs.map(t => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
            aria-selected={activeTab === t.id}
            role="tab"
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <>
          <div className="dashboard-grid">
            <DonutGauge
              percentage={evaluation.currentPercentage}
              status={evaluation.status}
              maxAchievable={evaluation.maxAchievablePercentage}
            />
            <SummaryCards evaluation={evaluation} />
          </div>
          <FuturePlanner
            evaluation={evaluation}
            asOfDate={asOfDate}
            futureDate={futureDate}
            onFutureDateChange={setFutureDate}
          />
        </>
      )}

      {/* ── Charts ── */}
      {activeTab === 'charts' && (
        <AttendanceCharts
          evaluation={evaluation}
          distribution={distribution}
          section={selectedSection}
        />
      )}

      {/* ── OD / Leave ── */}
      {activeTab === 'leave' && (
        <LeaveSimulator
          section={selectedSection}
          evaluation={evaluation}
          distribution={distribution}
          asOfDate={asOfDate}
        />
      )}

      {/* ── Subjects ── */}
      {activeTab === 'subjects' && (
        <SubjectBreakdown
          subjectStats={distribution.subjectStats}
          subjectPercentages={subjectPercentages}
          onSubjectPercentageChange={handleSubjectPercentageChange}
        />
      )}

      {/* ── Timetable ── */}
      {activeTab === 'timetable' && (
        <TimetableSchedule section={selectedSection} asOfDate={asOfDate} />
      )}

      {/* ── Floating AI Chatbot ── */}
      <AttendanceAdvisor
        section={selectedSection}
        evaluation={evaluation}
        distribution={distribution}
        asOfDate={asOfDate}
        futureDate={futureDate}
        student={student}
      />
    </div>
  );
}
