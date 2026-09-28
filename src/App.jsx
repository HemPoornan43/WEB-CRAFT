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

// ─── Compute overall % from DB attendance rows ───
function computeOverallFromDB(attendanceRows) {
  if (!attendanceRows || attendanceRows.length === 0) return 75;
  const totalAttended = attendanceRows.reduce((s, r) => s + (r.attended || 0), 0);
  const totalClasses  = attendanceRows.reduce((s, r) => s + (r.total || 0), 0);
  if (totalClasses === 0) return 75;
  return parseFloat(((totalAttended / totalClasses) * 100).toFixed(2));
}

export default function App() {
  // ── Auth state ──
  const [student, setStudent]       = useState(null);
  const [dbAttendance, setDbAttendance] = useState([]);

  // ── Dashboard state ──
  const [selectedSectionId, setSelectedSectionId] = useState(CLASS_SECTIONS[0].id);
  const [asOfDate, setAsOfDate]       = useState(DEFAULT_TODAY_DATE);
  const [futureDate, setFutureDate]   = useState(SEMESTER_END_DATE);
  const [overallPercentage, setOverallPercentage] = useState(75);
  const [mode, setMode]               = useState('quick');
  const [activeTab, setActiveTab]     = useState('overview');

  // ── Login handler: sets student + loads attendance from DB ──
  const handleLogin = (studentData, attendanceRows) => {
    setStudent(studentData);
    setDbAttendance(attendanceRows);

    // Auto-select their section
    const matchedSection = CLASS_SECTIONS.find(s => s.id === studentData.section_id);
    if (matchedSection) setSelectedSectionId(matchedSection.id);

    // Auto-compute overall attendance % from DB records
    const computedPct = computeOverallFromDB(attendanceRows);
    setOverallPercentage(computedPct);
  };

  const handleLogout = () => {
    setStudent(null);
    setDbAttendance([]);
    setOverallPercentage(75);
    setSelectedSectionId(CLASS_SECTIONS[0].id);
    setActiveTab('overview');
  };

  // ── Show login screen if not authenticated ──
  if (!student) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ── Dashboard logic ──
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
      pastClasses: distribution.overallPast,
      remainingClasses: distribution.overallRemaining,
      totalClasses: distribution.overallTotal,
    }),
    [overallPercentage, distribution]
  );

  const tabs = [
    { id: 'overview',  label: '📊 Overview',   title: 'Dashboard Overview' },
    { id: 'charts',    label: '📈 Charts',      title: 'Attendance Health Charts' },
    { id: 'leave',     label: '📋 OD / Leave',  title: 'Leave & OD Simulator' },
    { id: 'subjects',  label: '📚 Subjects',    title: 'Subject-Wise Breakdown' },
    { id: 'timetable', label: '🗓️ Timetable',   title: 'Weekly Schedule Matrix' },
  ];

  return (
    <div className="app-container">
      {/* Header with student info + logout */}
      <header className="top-nav">
        <div className="brand-wrapper">
          <div className="pixel-logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="m9 9.5 2 2 4-4" />
            </svg>
          </div>
          <div className="brand-info">
            <h1>THE ATTENDANCE PREDICTOR</h1>
            <span className="brand-badge">ROUND 1 · THE OVERWORLD · VIBECRAFT 2026</span>
          </div>
        </div>

        <div className="nav-actions">
          {/* Student info pill */}
          <div className="student-info-pill">
            <span className="student-avatar">👤</span>
            <div className="student-pill-text">
              <span className="student-pill-name">{student.name}</span>
              <span className="student-pill-reg">{student.register_no}</span>
            </div>
          </div>

          <div className="status-pill">
            <span className="pulse-dot" />
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

      {/* DB attendance snapshot banner */}
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

      {/* ── Tab: Overview ── */}
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

      {/* ── Tab: Charts ── */}
      {activeTab === 'charts' && (
        <AttendanceCharts
          evaluation={evaluation}
          distribution={distribution}
          section={selectedSection}
        />
      )}

      {/* ── Tab: OD / Leave ── */}
      {activeTab === 'leave' && (
        <LeaveSimulator
          section={selectedSection}
          evaluation={evaluation}
          distribution={distribution}
          asOfDate={asOfDate}
        />
      )}

      {/* ── Tab: Subjects ── */}
      {activeTab === 'subjects' && (
        <SubjectBreakdown
          section={selectedSection}
          distribution={distribution}
          overallPercentage={overallPercentage}
          dbAttendance={dbAttendance}
        />
      )}

      {/* ── Tab: Timetable ── */}
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
