import React, { useMemo } from 'react';

// ─── Horizontal Bar Chart for Subject Class Load ───
function SubjectLoadBar({ name, color, weekly, total, past, remaining }) {
  const pastPct   = total > 0 ? (past / total) * 100 : 0;
  const remPct    = total > 0 ? (remaining / total) * 100 : 0;
  const shortName = name.length > 28 ? name.slice(0, 26) + '…' : name;

  return (
    <div className="chart-bar-row">
      <div className="chart-bar-label">
        <span className="chart-bar-dot" style={{ background: color }} />
        <span className="chart-bar-name">{shortName}</span>
      </div>
      <div className="chart-bar-track">
        <div className="chart-bar-fill-past"
          style={{ width: `${pastPct}%`, background: color, opacity: 0.85 }} />
        <div className="chart-bar-fill-rem"
          style={{ width: `${remPct}%`, background: color, opacity: 0.25 }} />
      </div>
      <div className="chart-bar-meta">
        <span style={{ color }}>{past}</span>
        <span className="chart-bar-sep">/</span>
        <span>{total}</span>
        <span className="chart-bar-weekly">({weekly}/wk)</span>
      </div>
    </div>
  );
}

// ─── SVG Area Projection Chart ───
function ProjectionChart({ evaluation }) {
  const W = 560, H = 180;
  const PAD = { top: 16, right: 20, bottom: 36, left: 44 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const { attendedPast, pastClasses, remainingClasses, totalClasses,
          currentPercentage, requiredClasses75, requiredClasses90 } = evaluation;

  // Build 3 scenario lines: attend-all, attend-for-75, bunk-all
  // X axis: class index (0 → totalClasses), Y axis: % (0–100)
  const points = useMemo(() => {
    const now = pastClasses;
    const total = totalClasses;
    if (total === 0) return { all: [], safe75: [], bunkAll: [] };

    const makePoints = (futureAttendCount) => {
      // Past: fixed % at each step
      const pts = [];
      // start point
      pts.push([0, 0]);
      // current point
      pts.push([now, (attendedPast / total) * 100]);
      // end point
      const finalAttended = attendedPast + futureAttendCount;
      pts.push([total, (finalAttended / total) * 100]);
      return pts;
    };

    return {
      all:    makePoints(remainingClasses),
      safe75: makePoints(Math.min(remainingClasses, requiredClasses75)),
      bunkAll: makePoints(0),
    };
  }, [evaluation]);

  const toSVG = ([x, y]) => [
    PAD.left + (x / totalClasses) * cW,
    PAD.top + cH - (y / 100) * cH
  ];

  const line = (pts) => pts.map((p, i) => {
    const [sx, sy] = toSVG(p);
    return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
  }).join(' ');

  const thresholdY75 = PAD.top + cH - (75 / 100) * cH;
  const thresholdY90 = PAD.top + cH - (90 / 100) * cH;

  const yTicks = [0, 25, 50, 75, 90, 100];
  const xNow = PAD.left + (pastClasses / (totalClasses || 1)) * cW;

  return (
    <div className="chart-projection-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
        {/* Grid */}
        {yTicks.map(v => {
          const y = PAD.top + cH - (v / 100) * cH;
          return (
            <g key={v}>
              <line x1={PAD.left} y1={y} x2={PAD.left + cW} y2={y}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={PAD.left - 6} y={y + 4} fill="#64748b"
                fontSize="9" textAnchor="end">{v}%</text>
            </g>
          );
        })}

        {/* 75% threshold */}
        <line x1={PAD.left} y1={thresholdY75} x2={PAD.left + cW} y2={thresholdY75}
          stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
        <text x={PAD.left + cW + 3} y={thresholdY75 + 4} fill="#f59e0b"
          fontSize="8">75%</text>

        {/* 90% threshold */}
        <line x1={PAD.left} y1={thresholdY90} x2={PAD.left + cW} y2={thresholdY90}
          stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        <text x={PAD.left + cW + 3} y={thresholdY90 + 4} fill="#8b5cf6"
          fontSize="8">90%</text>

        {/* Today vertical */}
        <line x1={xNow} y1={PAD.top} x2={xNow} y2={PAD.top + cH}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
        <text x={xNow} y={PAD.top + cH + 14} fill="#94a3b8"
          fontSize="8" textAnchor="middle">Today</text>

        {/* Scenario: Bunk All */}
        {points.bunkAll.length > 0 && (
          <path d={line(points.bunkAll)} fill="none"
            stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6" />
        )}

        {/* Scenario: 75% target */}
        {points.safe75.length > 0 && (
          <path d={line(points.safe75)} fill="none"
            stroke="#f59e0b" strokeWidth="1.5" opacity="0.8" />
        )}

        {/* Scenario: Attend all */}
        {points.all.length > 0 && (
          <path d={line(points.all)} fill="none"
            stroke="#10b981" strokeWidth="2" />
        )}

        {/* Current dot */}
        <circle cx={toSVG([pastClasses, currentPercentage])[0]}
          cy={toSVG([pastClasses, currentPercentage])[1]}
          r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
      </svg>

      {/* Legend */}
      <div className="chart-legend">
        <span className="chart-legend-item" style={{ color: '#10b981' }}>
          <span className="chart-legend-line" style={{ background: '#10b981' }} />
          Attend All ({evaluation.maxAchievablePercentage.toFixed(1)}%)
        </span>
        <span className="chart-legend-item" style={{ color: '#f59e0b' }}>
          <span className="chart-legend-line" style={{ background: '#f59e0b' }} />
          Attend for 75%
        </span>
        <span className="chart-legend-item" style={{ color: '#ef4444' }}>
          <span className="chart-legend-line" style={{ background: '#ef4444', opacity: 0.7 }} />
          Bunk All ({evaluation.minAchievablePercentage.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}

// ─── Main AttendanceCharts component ───
export default function AttendanceCharts({ evaluation, distribution, section }) {
  const { subjectStats } = distribution;

  // Semester progress %
  const semesterProgress = distribution.overallTotal > 0
    ? Math.round((distribution.overallPast / distribution.overallTotal) * 100)
    : 0;

  return (
    <div className="charts-panel">
      {/* Header */}
      <div className="section-head" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="section-title">📈 Attendance Health Charts</h2>
          <p className="section-subtitle">
            Visual overview · {distribution.overallPast} of {distribution.overallTotal} total classes conducted
            · <strong style={{ color: '#3b82f6' }}>{semesterProgress}% semester complete</strong>
          </p>
        </div>
      </div>

      <div className="charts-grid">
        {/* Left: subject bar chart */}
        <div className="chart-box">
          <div className="chart-box-title">📚 Subject-Wise Class Distribution</div>
          <div className="chart-bars-container">
            {subjectStats.map(sub => (
              <SubjectLoadBar
                key={sub.code}
                name={sub.name}
                color={sub.color}
                weekly={sub.weeklyClasses}
                total={sub.totalClasses}
                past={sub.pastClasses}
                remaining={sub.remainingClasses}
              />
            ))}
          </div>
          <div className="chart-box-footer">
            <span className="chart-legend-item">
              <span className="chart-legend-dot" style={{ background: 'rgba(255,255,255,0.6)' }} />
              Solid = Conducted
            </span>
            <span className="chart-legend-item">
              <span className="chart-legend-dot" style={{ background: 'rgba(255,255,255,0.2)' }} />
              Faded = Remaining
            </span>
          </div>
        </div>

        {/* Right: projection chart */}
        <div className="chart-box">
          <div className="chart-box-title">🔭 Attendance Trajectory Projection</div>
          <ProjectionChart evaluation={evaluation} />

          {/* Mini stats */}
          <div className="chart-mini-stats">
            <div className="chart-mini-stat">
              <span className="chart-mini-num" style={{ color: '#10b981' }}>
                {evaluation.maxAchievablePercentage.toFixed(1)}%
              </span>
              <span className="chart-mini-lbl">Best Case</span>
            </div>
            <div className="chart-mini-stat">
              <span className="chart-mini-num" style={{ color: '#3b82f6' }}>
                {evaluation.currentPercentage.toFixed(1)}%
              </span>
              <span className="chart-mini-lbl">Current</span>
            </div>
            <div className="chart-mini-stat">
              <span className="chart-mini-num" style={{ color: '#ef4444' }}>
                {evaluation.minAchievablePercentage.toFixed(1)}%
              </span>
              <span className="chart-mini-lbl">Worst Case</span>
            </div>
            <div className="chart-mini-stat">
              <span className="chart-mini-num" style={{ color: '#f59e0b' }}>
                {evaluation.safeBunks75}
              </span>
              <span className="chart-mini-lbl">Safe Bunks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
