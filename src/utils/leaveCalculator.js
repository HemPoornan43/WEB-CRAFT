// Leave Calculator — computes OD / Medical / Casual leave impact on attendance
// Semester: Aug 29 – Nov 29, 2026

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayName(dateStr) {
  return DAY_NAMES[new Date(dateStr).getDay()];
}

export function getDateRange(startStr, endStr) {
  const dates = [];
  const end = new Date(endStr);
  const cur = new Date(startStr);
  while (cur <= end) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

/**
 * Calculate which scheduled classes fall on leave days.
 * @param {object} section – full section object (with schedule + subjects)
 * @param {string} leaveStartStr – 'YYYY-MM-DD'
 * @param {string} leaveEndStr   – 'YYYY-MM-DD'
 * @param {string[]|null} affectedSubjectCodes – null = all subjects
 * @returns {{ leaveDates, missedBySubject, totalMissed, missedDays }}
 */
export function calculateLeaveImpact(section, leaveStartStr, leaveEndStr, affectedSubjectCodes = null) {
  const leaveDates = getDateRange(leaveStartStr, leaveEndStr);

  const missedBySubject = {};
  section.subjects.forEach(sub => { missedBySubject[sub.code] = 0; });

  const missedDays = [];

  leaveDates.forEach(dateStr => {
    const dayName = getDayName(dateStr);
    const daySchedule = section.schedule[dayName] || [];
    const classesOnDay = [];

    daySchedule.forEach(slot => {
      if (!slot.subjectCode) return;
      if (!missedBySubject.hasOwnProperty(slot.subjectCode)) return;
      if (affectedSubjectCodes && !affectedSubjectCodes.includes(slot.subjectCode)) return;

      missedBySubject[slot.subjectCode] += 1;
      classesOnDay.push(slot.subjectCode);
    });

    if (classesOnDay.length > 0) {
      missedDays.push({ date: dateStr, day: dayName, subjectCodes: classesOnDay });
    }
  });

  const totalMissed = Object.values(missedBySubject).reduce((a, b) => a + b, 0);

  return { leaveDates, missedBySubject, totalMissed, missedDays };
}

/**
 * Simulate attendance AFTER applying the leave impact.
 * @param {object} evaluation  – from evaluateAttendance()
 * @param {object} distribution – from getSectionClassDistribution()
 * @param {object} leaveImpact – from calculateLeaveImpact()
 * @returns full impact report
 */
export function simulateLeaveAttendance(evaluation, distribution, leaveImpact) {
  const { attendedPast, totalClasses, remainingClasses } = evaluation;

  // After leave, the student can attend at most (remaining - missed) classes
  const newRemainingClasses = Math.max(0, remainingClasses - leaveImpact.totalMissed);

  // "Best case" = attend all non-leave remaining
  const newMaxAttended = attendedPast + newRemainingClasses;
  const newMaxPercentage = totalClasses > 0 ? (newMaxAttended / totalClasses) * 100 : 0;

  // Original max (without leave)
  const origMaxPercentage = totalClasses > 0 ? ((attendedPast + remainingClasses) / totalClasses) * 100 : 0;

  const percentageDrop = origMaxPercentage - newMaxPercentage;

  // Per-subject impact
  const subjectImpacts = distribution.subjectStats.map(sub => {
    const missed = leaveImpact.missedBySubject[sub.code] || 0;

    // Use overall % as proxy for per-subject attended (best estimate without per-subject input)
    const subAttended = Math.round((evaluation.currentPercentage / 100) * sub.pastClasses);
    const subNewRemaining = Math.max(0, sub.remainingClasses - missed);
    const subTotal = sub.totalClasses;

    const origSubMax = subTotal > 0 ? ((subAttended + sub.remainingClasses) / subTotal) * 100 : 0;
    const newSubMax  = subTotal > 0 ? ((subAttended + subNewRemaining)  / subTotal) * 100 : 0;

    return {
      code: sub.code,
      name: sub.name,
      color: sub.color,
      classesMissed: missed,
      origMaxPercentage: origSubMax,
      newMaxPercentage: newSubMax,
      drop: origSubMax - newSubMax,
      willDropBelow75: newSubMax < 75,
      willDropBelow90: newSubMax < 90,
    };
  });

  // 75% requirement after leave
  const neededFor75 = Math.ceil(0.75 * totalClasses);
  const requiredAfterLeave = Math.max(0, neededFor75 - attendedPast);
  const is75AchievableAfterLeave = requiredAfterLeave <= newRemainingClasses;

  return {
    totalMissed: leaveImpact.totalMissed,
    missedDays: leaveImpact.missedDays,
    newRemainingClasses,
    origMaxPercentage,
    newMaxPercentage,
    percentageDrop,
    is75AchievableAfterLeave,
    requiredAfterLeave,
    subjectsAtRisk: subjectImpacts.filter(s => s.willDropBelow75 && s.classesMissed > 0),
    subjectImpacts,
  };
}
