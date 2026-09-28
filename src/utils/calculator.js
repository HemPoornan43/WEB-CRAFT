// Pure calculation engine for Attendance Predictor
import { SEMESTER_START_DATE, SEMESTER_END_DATE } from '../data/timetableData.js';

// Count specific weekdays between two dates inclusive
export function countWeekdaysBetween(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const counts = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (start > end) return counts;

  const cur = new Date(start);
  while (cur <= end) {
    const dayName = dayNames[cur.getDay()];
    counts[dayName] = (counts[dayName] || 0) + 1;
    cur.setDate(cur.getDate() + 1);
  }
  return counts;
}

// Compute total, past, and remaining classes for a section and its subjects
export function getSectionClassDistribution(section, asOfDateStr, futureDateStr = SEMESTER_END_DATE) {
  const pastWeekdayCounts = countWeekdaysBetween(SEMESTER_START_DATE, asOfDateStr);
  // Future planning count is from day after asOfDate up to futureDateStr
  const asOf = new Date(asOfDateStr);
  const nextDay = new Date(asOf);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];

  const remainingWeekdayCounts = countWeekdaysBetween(nextDayStr, futureDateStr);
  const fullSemesterWeekdayCounts = countWeekdaysBetween(SEMESTER_START_DATE, SEMESTER_END_DATE);

  // Helper to count periods for a subject or overall on a given day of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Count scheduled classes per day from the schedule
  const subjectDayCounts = {};
  section.subjects.forEach(sub => {
    subjectDayCounts[sub.code] = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, totalWeekly: 0 };
  });

  daysOfWeek.forEach(day => {
    const daySchedule = section.schedule[day] || [];
    daySchedule.forEach(slot => {
      if (slot.subjectCode && subjectDayCounts[slot.subjectCode]) {
        subjectDayCounts[slot.subjectCode][day] += 1;
        subjectDayCounts[slot.subjectCode].totalWeekly += 1;
      }
    });
  });

  // Calculate overall and subject-level stats
  let overallTotal = 0;
  let overallPast = 0;
  let overallRemaining = 0;

  const subjectStats = section.subjects.map(sub => {
    const dayMap = subjectDayCounts[sub.code] || {};
    let totalClasses = 0;
    let pastClasses = 0;
    let remainingClasses = 0;

    daysOfWeek.forEach(day => {
      const perDay = dayMap[day] || 0;
      totalClasses += perDay * (fullSemesterWeekdayCounts[day] || 0);
      pastClasses += perDay * (pastWeekdayCounts[day] || 0);
      remainingClasses += perDay * (remainingWeekdayCounts[day] || 0);
    });

    overallTotal += totalClasses;
    overallPast += pastClasses;
    overallRemaining += remainingClasses;

    return {
      code: sub.code,
      name: sub.name,
      faculty: sub.faculty,
      credits: sub.credits,
      slot: sub.slot,
      color: sub.color,
      weeklyClasses: sub.weeklyClasses,
      totalClasses,
      pastClasses,
      remainingClasses
    };
  });

  return {
    asOfDate: asOfDateStr,
    futureDate: futureDateStr,
    overallTotal,
    overallPast,
    overallRemaining,
    subjectStats
  };
}

// Core Attendance Evaluation Logic
export function evaluateAttendance({ currentPercentage, pastClasses, remainingClasses, totalClasses }) {
  const pCurr = Math.min(100, Math.max(0, Number(currentPercentage) || 0));
  
  // Attended so far
  const attendedPast = Math.round((pCurr / 100) * pastClasses);
  const missedPast = pastClasses - attendedPast;

  // Maximum and Minimum possible attendance at semester end
  const maxPossibleAttended = attendedPast + remainingClasses;
  const maxAchievablePercentage = totalClasses > 0 ? (maxPossibleAttended / totalClasses) * 100 : 100;
  const minAchievablePercentage = totalClasses > 0 ? (attendedPast / totalClasses) * 100 : 0;

  // Target 75% Requirement
  const neededFor75 = Math.ceil(0.75 * totalClasses);
  const requiredClasses75 = Math.max(0, neededFor75 - attendedPast);
  const is75Achievable = requiredClasses75 <= remainingClasses;

  // Target 90% Requirement
  const neededFor90 = Math.ceil(0.90 * totalClasses);
  const requiredClasses90 = Math.max(0, neededFor90 - attendedPast);
  const is90Achievable = requiredClasses90 <= remainingClasses;

  // Bunk Allowance (How many remaining classes can be safely skipped while staying >= 75%)
  let safeBunks75 = 0;
  if (is75Achievable) {
    safeBunks75 = Math.max(0, remainingClasses - requiredClasses75);
  }

  // Bunk Allowance for 90%
  let safeBunks90 = 0;
  if (is90Achievable) {
    safeBunks90 = Math.max(0, remainingClasses - requiredClasses90);
  }

  // Determine Warning System Status
  let status = 'SAFE_ZONE';
  let statusMessage = '';
  let statusColor = '#10B981';

  if (!is75Achievable) {
    status = 'IRREVERSIBLE_DETENTION';
    statusMessage = 'IRREVERSIBLE DETENTION: Even with 100% future attendance, maximum achievable is ' + maxAchievablePercentage.toFixed(1) + '% (< 75%). Detention before November cannot be avoided.';
    statusColor = '#EF4444';
  } else if (pCurr < 75) {
    status = 'DANGER_ZONE';
    statusMessage = 'DANGER ZONE: Attendance is currently below 75%. You MUST attend at least ' + requiredClasses75 + ' of the remaining ' + remainingClasses + ' classes to escape detention.';
    statusColor = '#F59E0B';
  } else if (pCurr < 80) {
    status = 'WARNING_BORDERLINE';
    statusMessage = 'BORDERLINE RISK: You are barely above detention. You can only afford to miss ' + safeBunks75 + ' more class' + (safeBunks75 === 1 ? '' : 'es') + '.';
    statusColor = '#F97316';
  } else if (pCurr >= 90) {
    status = 'DISTINCTION';
    statusMessage = 'DISTINCTION ZONE: Stellar attendance! You can safely miss up to ' + safeBunks75 + ' classes while staying above 75%, or ' + safeBunks90 + ' classes to stay above 90%.';
    statusColor = '#10B981';
  } else {
    status = 'SAFE_ZONE';
    statusMessage = 'SAFE ZONE: In good standing. Attend ' + requiredClasses90 + ' more classes to climb to 90% distinction.';
    statusColor = '#3B82F6';
  }

  return {
    currentPercentage: pCurr,
    pastClasses,
    attendedPast,
    missedPast,
    remainingClasses,
    totalClasses,
    maxAchievablePercentage,
    minAchievablePercentage,
    neededFor75,
    requiredClasses75,
    is75Achievable,
    safeBunks75,
    neededFor90,
    requiredClasses90,
    is90Achievable,
    safeBunks90,
    status,
    statusMessage,
    statusColor
  };
}

// Simulate future attendance if user attends N of the future classes
export function simulateFutureAttendance(evaluated, classesWillAttend) {
  const attend = Math.min(evaluated.remainingClasses, Math.max(0, Number(classesWillAttend) || 0));
  const newAttended = evaluated.attendedPast + attend;
  const simulatedPercentage = evaluated.totalClasses > 0 ? (newAttended / evaluated.totalClasses) * 100 : 0;
  return {
    classesWillAttend: attend,
    classesWillBunk: evaluated.remainingClasses - attend,
    projectedTotalAttended: newAttended,
    projectedPercentage: simulatedPercentage,
    willBeDetained: simulatedPercentage < 75,
    willReachDistinction: simulatedPercentage >= 90
  };
}
