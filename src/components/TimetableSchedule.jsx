import React, { useState } from 'react';
import { PERIOD_SLOTS } from '../data/timetableData.js';

export default function TimetableSchedule({ section }) {
  const [activeDay, setActiveDay] = useState('ALL');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const subjectMap = {};
  section.subjects.forEach(s => {
    subjectMap[s.code] = s;
  });

  const displayDays = activeDay === 'ALL' ? days : [activeDay];

  return (
    <section className="timetable-wrapper" aria-label="Class Timetable Matrix">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '1.15rem', fontWeight: 700 }}>
            🗓️ Official Weekly Schedule — {section.name}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Venue: <strong>{section.venue}</strong> · Coordinator: <strong>{section.coordinator}</strong> · {section.semester}
          </p>
        </div>

        {/* Day selector tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`btn ${activeDay === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.72rem', padding: '5px 10px' }}
            onClick={() => setActiveDay('ALL')}
          >
            Full Week
          </button>
          {days.map(d => (
            <button
              key={d}
              type="button"
              className={`btn ${activeDay === d ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.72rem', padding: '5px 10px' }}
              onClick={() => setActiveDay(d)}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="timetable-grid-table">
          <thead>
            <tr>
              <th style={{ width: '110px', textAlign: 'left', paddingLeft: '14px' }}>Day</th>
              <th>P1<br/><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>09:00</span></th>
              <th>P2<br/><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>09:50</span></th>
              <th style={{ width: '45px' }}>Tea</th>
              <th>P3<br/><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>10:50</span></th>
              <th>P4<br/><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>11:40</span></th>
              <th style={{ width: '60px' }}>Lunch</th>
              <th>P6<br/><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>01:20</span></th>
              <th>P7<br/><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>02:10</span></th>
              <th style={{ width: '45px' }}>Tea</th>
              <th>P8<br/><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>03:10</span></th>
              <th>P9<br/><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>04:00</span></th>
            </tr>
          </thead>
          <tbody>
            {displayDays.map(day => {
              const daySlots = section.schedule[day] || [];
              const getSlot = (pNum) => daySlots.find(s => s.period === pNum);

              return (
                <tr key={day}>
                  <td className="tt-day-cell">{day}</td>
                  
                  {/* Period 1 */}
                  {renderCell(getSlot(1), subjectMap)}
                  
                  {/* Period 2 */}
                  {renderCell(getSlot(2), subjectMap)}

                  {/* Tea 1 */}
                  <td className="tt-break-cell">Tea</td>

                  {/* Period 3 */}
                  {renderCell(getSlot(3), subjectMap)}

                  {/* Period 4 */}
                  {renderCell(getSlot(4), subjectMap)}

                  {/* Lunch */}
                  <td className="tt-break-cell" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>Lunch</td>

                  {/* Period 6 */}
                  {renderCell(getSlot(6), subjectMap)}

                  {/* Period 7 */}
                  {renderCell(getSlot(7), subjectMap)}

                  {/* Tea 2 */}
                  <td className="tt-break-cell">Tea</td>

                  {/* Period 8 */}
                  {renderCell(getSlot(8), subjectMap)}

                  {/* Period 9 */}
                  {renderCell(getSlot(9), subjectMap)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function renderCell(slot, subjectMap) {
  if (!slot) {
    return (
      <td style={{ background: 'rgba(255, 255, 255, 0.01)', color: 'var(--text-dim)' }}>
        —
      </td>
    );
  }

  const sub = subjectMap[slot.subjectCode];
  const color = sub ? sub.color : '#3b82f6';
  const name = sub ? sub.name : slot.subjectCode;

  return (
    <td>
      <div 
        className="tt-slot-card" 
        style={{ borderLeft: `3px solid ${color}` }}
        title={`${slot.subjectCode}: ${name} (${sub ? sub.faculty : ''})`}
      >
        <span className="tt-sub-code" style={{ color: color }}>
          {sub ? (sub.slot ? `Slot ${sub.slot}` : slot.subjectCode) : slot.subjectCode}
        </span>
        <span style={{ fontSize: '0.7rem', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85px' }}>
          {sub ? sub.name.split(' ')[0] : ''}
        </span>
        <span className="tt-sub-room">
          {slot.room || 'IST'}
        </span>
      </div>
    </td>
  );
}
