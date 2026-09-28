// Timetable data for all 10 Class Sections (VibeCraft 2026 Dataset)
// Semester Duration: August 29, 2026 to November 29, 2026

export const SEMESTER_START_DATE = '2026-08-29';
export const SEMESTER_END_DATE = '2026-11-29';
export const DEFAULT_TODAY_DATE = '2026-09-28'; // Default date as of contest launch

export const PERIOD_SLOTS = [
  { period: 1, label: '09:00 - 09:50', isBreak: false },
  { period: 2, label: '09:50 - 10:40', isBreak: false },
  { period: 'tea1', label: '10:40 - 10:50 (Tea Break)', isBreak: true },
  { period: 3, label: '10:50 - 11:40', isBreak: false },
  { period: 4, label: '11:40 - 12:30', isBreak: false },
  { period: 5, label: '12:30 - 01:20 (Lunch)', isBreak: true },
  { period: 6, label: '01:20 - 02:10', isBreak: false },
  { period: 7, label: '02:10 - 03:00', isBreak: false },
  { period: 'tea2', label: '03:00 - 03:10 (Tea Break)', isBreak: true },
  { period: 8, label: '03:10 - 04:00', isBreak: false },
  { period: 9, label: '04:00 - 04:50', isBreak: false }
];

export const CLASS_SECTIONS = [
  {
    id: 'I-ECE-A',
    name: 'I ECE-A',
    fullName: 'I Year B.Tech ECE - Section A',
    semester: 'Semester I',
    year: '1st Year',
    department: 'Electronics & Communication Engineering',
    venue: 'IST 602 / FN',
    coordinator: 'SEEE Dept',
    subjects: [
      { code: '21MAB102T', name: 'Advanced Calculus and Complex Analysis', slot: 'A', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Dr. R. Ragul', dept: 'Maths', color: '#6366F1' },
      { code: '21CYB101J', name: 'Chemistry', slot: 'B', credits: '3-1-2-5', weeklyClasses: 6, faculty: 'Dr. P. Pachamuthu', dept: 'Chemistry', color: '#10B981' },
      { code: '21BTB102J', name: 'Electronic System and PCB Design', slot: 'C', credits: '2-0-0-2', weeklyClasses: 2, faculty: 'Dr. U. Shajith Ali', dept: 'EEE', color: '#F59E0B' },
      { code: '21CSS101J', name: 'Programming for Problem Solving', slot: 'D', credits: '3-0-2-4', weeklyClasses: 5, faculty: 'Dr. A. Rama Prasath', dept: 'CA', color: '#EC4899' },
      { code: '21GNH101J', name: 'Philosophy of Engineering', slot: 'E', credits: '1-0-2-2', weeklyClasses: 3, faculty: 'Dr. R. Aarthi', dept: 'Physics', color: '#8B5CF6' },
      { code: '21BTB103T', name: 'Biology', slot: 'F', credits: '2-0-0-2', weeklyClasses: 2, faculty: 'Dr. M. Jaya Priya', dept: 'Biotech', color: '#14B8A6' },
      { code: '21LEH104T', name: 'German Language', slot: 'G', credits: '2-1-0-3', weeklyClasses: 3, faculty: 'Mr. Selva', dept: 'German', color: '#3B82F6' },
      { code: '21MES101L', name: 'Basic Civil and Mechanical Workshop', slot: 'WS', credits: '0-0-4-2', weeklyClasses: 4, faculty: 'Dr. N.S. Balaji / Kumaran', dept: 'Mech', color: '#EF4444' },
      { code: '21PDM102L', name: 'General Aptitude (CDC)', slot: 'CDC', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'Mr. Sivanandhan', dept: 'CDC', color: '#F97316' },
      { code: '21GNM102L', name: 'NSS / Social Outreach', slot: 'NSS', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'Dr. R. Manickam', dept: 'Physical Dir', color: '#06B6D4' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21GNH101J', room: 'IST602' },
        { period: 2, subjectCode: '21GNH101J', room: 'IST602' },
        { period: 3, subjectCode: '21CYB101J', room: 'IST602' },
        { period: 4, subjectCode: '21MAB102T', room: 'IST602' },
        { period: 6, subjectCode: '21CYB101J', room: 'Che Lab' },
        { period: 7, subjectCode: '21CYB101J', room: 'Che Lab' },
        { period: 8, subjectCode: '21BTB103T', room: 'IST710' },
        { period: 9, subjectCode: '21PDM102L', room: 'IST710' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21BTB102J', room: 'IST602' },
        { period: 2, subjectCode: '21CYB101J', room: 'IST602' },
        { period: 3, subjectCode: '21MAB102T', room: 'IST602' },
        { period: 4, subjectCode: '21CSS101J', room: 'IST602' },
        { period: 6, subjectCode: '21MES101L', room: 'IST 20,21' },
        { period: 7, subjectCode: '21MES101L', room: 'IST 20,21' },
        { period: 8, subjectCode: '21MES101L', room: 'IST 20,21' },
        { period: 9, subjectCode: '21MES101L', room: 'IST 20,21' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21CYB101J', room: 'IST602' },
        { period: 2, subjectCode: '21GNH101J', room: 'IST602' },
        { period: 3, subjectCode: '21CSS101J', room: 'IST602' },
        { period: 6, subjectCode: '21CSS101J', room: 'PPS LAB' },
        { period: 7, subjectCode: '21CSS101J', room: 'PPS LAB' },
        { period: 8, subjectCode: '21BTB102J', room: 'PCB Lab' },
        { period: 9, subjectCode: '21BTB102J', room: 'PCB Lab' }
      ],
      Thursday: [
        { period: 1, subjectCode: '21LEH104T', room: 'IST602' },
        { period: 2, subjectCode: '21LEH104T', room: 'IST602' },
        { period: 4, subjectCode: '21MAB102T', room: 'IST602' },
        { period: 6, subjectCode: '21PDM102L', room: 'IST510' },
        { period: 7, subjectCode: '21PDM102L', room: 'IST510' },
        { period: 8, subjectCode: '21GNM102L', room: 'IST201' },
        { period: 9, subjectCode: '21GNM102L', room: 'IST201' }
      ],
      Friday: [
        { period: 1, subjectCode: '21CSS101J', room: 'IST602' },
        { period: 2, subjectCode: '21MAB102T', room: 'IST602' },
        { period: 3, subjectCode: '21BTB102J', room: 'IST602' },
        { period: 4, subjectCode: '21CYB101J', room: 'IST602' },
        { period: 6, subjectCode: '21BTB103T', room: 'IST602' },
        { period: 8, subjectCode: '21LEH104T', room: 'IST626' },
        { period: 9, subjectCode: '21LEH104T', room: 'IST626' }
      ]
    }
  },
  {
    id: 'II-BME',
    name: 'II BME',
    fullName: 'II Year B.Tech Biomedical Engineering',
    semester: 'Semester III',
    year: '2nd Year',
    department: 'Biomedical Engineering / SEEE',
    venue: 'IST 602 / FN',
    coordinator: 'Dr. Senthil Kumaran V N',
    subjects: [
      { code: '21MAB201T', name: 'Transforms and Boundary Value Problems', slot: 'A', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Dr. A. Manickam', dept: 'Maths', color: '#6366F1' },
      { code: '21BMC202T', name: 'Biomedical Signals and Systems', slot: 'B', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. Senthil Kumaran V N', dept: 'ECE', color: '#10B981' },
      { code: '21BMC203J', name: 'Electric and Electronic Circuits', slot: 'C', credits: '3-0-2-4', weeklyClasses: 4, faculty: 'Dr. Prabin Kumar Bera', dept: 'ECE', color: '#F59E0B' },
      { code: '21BMC204J', name: 'Digital Logic for Medical Systems', slot: 'D', credits: '2-0-2-3', weeklyClasses: 3, faculty: 'Dr. G. Gifta', dept: 'BME', color: '#EC4899' },
      { code: '21PYS202T', name: 'Medical Physics', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. D. Rajeswari', dept: 'Physics', color: '#8B5CF6' },
      { code: '21LEM201T', name: 'Professional Ethics', slot: 'F', credits: '1-0-0-0', weeklyClasses: 1, faculty: 'Dr. H. SriBhuvaneshwari', dept: 'ECE', color: '#14B8A6' },
      { code: '21LEM202T', name: 'Universal Human Values-II', slot: 'G', credits: '2-1-0-3', weeklyClasses: 3, faculty: 'Mrs. N. Suganthi', dept: 'ECE', color: '#3B82F6' },
      { code: '21PDM201L', name: 'Verbal Reasoning (CDC)', slot: 'H', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'CDC Faculty', dept: 'CDC', color: '#F97316' },
      { code: '21PDH201T', name: 'Social Engineering', slot: 'I', credits: '2-0-0-2', weeklyClasses: 2, faculty: 'Mrs. Francis Arockiya Mary', dept: 'EEE', color: '#06B6D4' },
      { code: '21BMC205L', name: 'DLMS & Circuit Laboratory', slot: 'LAB', credits: '0-0-4-2', weeklyClasses: 4, faculty: 'BME / ECE Lab Faculty', dept: 'BME', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21PYS202T', room: 'IST602' },
        { period: 2, subjectCode: '21BMC203J', room: 'IST602' },
        { period: 3, subjectCode: '21PDH201T', room: 'IST602' },
        { period: 4, subjectCode: '21PDH201T', room: 'IST602' },
        { period: 6, subjectCode: '21BMC205L', room: 'DLMS/EEC-107,309' },
        { period: 7, subjectCode: '21BMC205L', room: 'DLMS/EEC-107,309' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21BMC203J', room: 'IST602' },
        { period: 2, subjectCode: '21PYS202T', room: 'IST602' },
        { period: 3, subjectCode: '21BMC202T', room: 'IST602' },
        { period: 4, subjectCode: '21MAB201T', room: 'IST602' },
        { period: 6, subjectCode: '21PDM201L', room: 'H-TB-106' },
        { period: 7, subjectCode: '21PDM201L', room: 'H-TB-106' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21BMC202T', room: 'IST602' },
        { period: 2, subjectCode: '21BMC204J', room: 'IST602' },
        { period: 3, subjectCode: '21MAB201T', room: 'IST602' },
        { period: 6, subjectCode: '21PDM201L', room: 'H-TB-106' },
        { period: 7, subjectCode: '21LEM202T', room: 'G-602' }
      ],
      Thursday: [
        { period: 1, subjectCode: '21MAB201T', room: 'IST602' },
        { period: 2, subjectCode: '21PYS202T', room: 'IST602' },
        { period: 3, subjectCode: '21BMC202T', room: 'IST602' },
        { period: 4, subjectCode: '21BMC204J', room: 'IST602' },
        { period: 8, subjectCode: '21BMC205L', room: 'DLMS/EEC-107,309' },
        { period: 9, subjectCode: '21BMC205L', room: 'DLMS/EEC-107,309' }
      ],
      Friday: [
        { period: 1, subjectCode: '21LEM201T', room: 'IST602' },
        { period: 2, subjectCode: '21MAB201T', room: 'IST602' },
        { period: 3, subjectCode: '21BMC203J', room: 'IST602' },
        { period: 4, subjectCode: '21BMC204J', room: 'IST602' },
        { period: 8, subjectCode: '21LEM202T', room: 'G-602' }
      ]
    }
  },
  {
    id: 'II-ECE-DS-A',
    name: 'II ECE-DS A',
    fullName: 'II Year B.Tech ECE (Data Science) - Section A',
    semester: 'Semester III',
    year: '2nd Year',
    department: 'ECE (Data Science)',
    venue: 'IST 416 / FN',
    coordinator: 'Dr. Jeevanantham S',
    subjects: [
      { code: '21MAB201T', name: 'Transforms and Boundary Value Problems', slot: 'A', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Dr. C. Arun Kumar', dept: 'Maths', color: '#6366F1' },
      { code: '21ECC201T', name: 'Solid State Devices', slot: 'B', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. Jeevanantham S', dept: 'ECE-DS', color: '#10B981' },
      { code: '21CSS201T', name: 'Computer Organization and Architecture', slot: 'C', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Dr. P. Murugapandiyan', dept: 'ECE', color: '#F59E0B' },
      { code: '21ECC203T', name: 'Digital Logic Design', slot: 'D', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. S. Krishnakumar', dept: 'ECE-DS', color: '#EC4899' },
      { code: '21ECC205T', name: 'Electromagnetic Theory and Interference', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. V. Bharathi', dept: 'ECE', color: '#8B5CF6' },
      { code: '21LEM201T', name: 'Professional Ethics', slot: 'F', credits: '1-0-0-0', weeklyClasses: 1, faculty: 'Dr. Jothi M', dept: 'ECE', color: '#14B8A6' },
      { code: '21LEM202T', name: 'Universal Human Values-II', slot: 'G', credits: '2-1-0-3', weeklyClasses: 3, faculty: 'Mrs. N. Suganthi', dept: 'ECE', color: '#3B82F6' },
      { code: '21PDM201L', name: 'Verbal Reasoning (CDC)', slot: 'H', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'CDC Faculty', dept: 'CDC', color: '#F97316' },
      { code: '21PDH209T', name: 'Social Engineering', slot: 'I', credits: '2-0-0-2', weeklyClasses: 2, faculty: 'Mrs. D. Lavanya', dept: 'ECE', color: '#06B6D4' },
      { code: '21ECC211L', name: 'Devices and Digital IC Laboratory', slot: 'LAB', credits: '0-0-4-2', weeklyClasses: 4, faculty: 'Dr. Jeevanantham / Bharathi', dept: 'ECE-DS', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21ECC205T', room: 'IST416' },
        { period: 2, subjectCode: '21MAB201T', room: 'IST416' },
        { period: 3, subjectCode: '21PDH209T', room: 'IST416' },
        { period: 4, subjectCode: '21PDH209T', room: 'IST416' },
        { period: 6, subjectCode: '21LEM202T', room: 'G-602' },
        { period: 7, subjectCode: '21LEM202T', room: 'G-602' },
        { period: 8, subjectCode: '21ECC211L', room: 'LAB -309/107' },
        { period: 9, subjectCode: '21ECC211L', room: 'LAB -309/107' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21CSS201T', room: 'IST416' },
        { period: 2, subjectCode: '21MAB201T', room: 'IST416' },
        { period: 3, subjectCode: '21ECC205T', room: 'IST416' },
        { period: 4, subjectCode: '21ECC203T', room: 'IST416' },
        { period: 6, subjectCode: '21LEM202T', room: 'G-602' },
        { period: 8, subjectCode: '21PDM201L', room: 'H-TB-106' },
        { period: 9, subjectCode: '21PDM201L', room: 'H-TB-106' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21MAB201T', room: 'IST416' },
        { period: 2, subjectCode: '21ECC201T', room: 'IST416' },
        { period: 3, subjectCode: '21CSS201T', room: 'IST416' },
        { period: 4, subjectCode: '21ECC203T', room: 'IST416' },
        { period: 7, subjectCode: '21PDM201L', room: 'H-TB-106' }
      ],
      Thursday: [
        { period: 1, subjectCode: '21ECC201T', room: 'IST416' },
        { period: 2, subjectCode: '21CSS201T', room: 'IST416' },
        { period: 3, subjectCode: '21MAB201T', room: 'IST416' },
        { period: 4, subjectCode: '21LEM201T', room: 'IST416' },
        { period: 6, subjectCode: '21ECC211L', room: 'LAB -309/107' },
        { period: 7, subjectCode: '21ECC211L', room: 'LAB -309/107' }
      ],
      Friday: [
        { period: 1, subjectCode: '21ECC203T', room: 'IST416' },
        { period: 2, subjectCode: '21ECC201T', room: 'IST416' },
        { period: 3, subjectCode: '21ECC205T', room: 'IST416' },
        { period: 4, subjectCode: '21CSS201T', room: 'IST416' }
      ]
    }
  },
  {
    id: 'II-ECE-DS-B',
    name: 'II ECE-DS B',
    fullName: 'II Year B.Tech ECE (Data Science) - Section B',
    semester: 'Semester III',
    year: '2nd Year',
    department: 'ECE (Data Science)',
    venue: 'IST 411 / AN',
    coordinator: 'Dr. Krishnakumar S',
    subjects: [
      { code: '21MAB201T', name: 'Transforms and Boundary Value Problems', slot: 'A', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'New Faculty 3', dept: 'Maths', color: '#6366F1' },
      { code: '21ECC201T', name: 'Solid State Devices', slot: 'B', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. Jeevanantham S', dept: 'ECE-DS', color: '#10B981' },
      { code: '21CSS201T', name: 'Computer Organization and Architecture', slot: 'C', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Dr. P. Murugapandiyan', dept: 'ECE', color: '#F59E0B' },
      { code: '21ECC203T', name: 'Digital Logic Design', slot: 'D', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. S. Krishnakumar', dept: 'ECE-DS', color: '#EC4899' },
      { code: '21ECC205T', name: 'Electromagnetic Theory and Interference', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. V. Bharathi', dept: 'ECE', color: '#8B5CF6' },
      { code: '21LEM201T', name: 'Professional Ethics', slot: 'F', credits: '1-0-0-0', weeklyClasses: 1, faculty: 'Dr. K. Vigneshwaran', dept: 'ECE', color: '#14B8A6' },
      { code: '21LEM202T', name: 'Universal Human Values-II', slot: 'G', credits: '2-1-0-3', weeklyClasses: 3, faculty: 'Mrs. D. Lavanya', dept: 'ECE', color: '#3B82F6' },
      { code: '21PDM201L', name: 'Verbal Reasoning (CDC)', slot: 'H', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'CDC Faculty', dept: 'CDC', color: '#F97316' },
      { code: '21PDH209T', name: 'Social Engineering', slot: 'I', credits: '2-0-0-2', weeklyClasses: 2, faculty: 'Mrs. D. Lavanya', dept: 'ECE', color: '#06B6D4' },
      { code: '21ECC211L', name: 'Devices and Digital IC Laboratory', slot: 'LAB', credits: '0-0-4-2', weeklyClasses: 4, faculty: 'Dr. S. Krishnakumar', dept: 'ECE-DS', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 3, subjectCode: '21ECC211L', room: 'LAB -309/107' },
        { period: 4, subjectCode: '21ECC211L', room: 'LAB -309/107' },
        { period: 6, subjectCode: '21ECC203T', room: 'IST411' },
        { period: 7, subjectCode: '21ECC201T', room: 'IST411' },
        { period: 8, subjectCode: '21CSS201T', room: 'IST411' },
        { period: 9, subjectCode: '21PDH209T', room: 'IST411' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21ECC211L', room: 'LAB -309/107' },
        { period: 2, subjectCode: '21ECC211L', room: 'LAB -309/107' },
        { period: 6, subjectCode: '21CSS201T', room: 'IST411' },
        { period: 7, subjectCode: '21ECC203T', room: 'IST411' },
        { period: 8, subjectCode: '21ECC205T', room: 'IST411' },
        { period: 9, subjectCode: '21MAB201T', room: 'IST411' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21LEM202T', room: 'G-401' },
        { period: 2, subjectCode: '21LEM202T', room: 'G-401' },
        { period: 6, subjectCode: '21PDH209T', room: 'IST411' },
        { period: 7, subjectCode: '21ECC205T', room: 'IST411' },
        { period: 8, subjectCode: '21MAB201T', room: 'IST411' },
        { period: 9, subjectCode: '21ECC203T', room: 'IST411' }
      ],
      Thursday: [
        { period: 2, subjectCode: '21LEM202T', room: 'G-401' },
        { period: 3, subjectCode: '21PDM201L', room: 'H-TB-106' },
        { period: 4, subjectCode: '21PDM201L', room: 'H-TB-106' },
        { period: 6, subjectCode: '21MAB201T', room: 'IST411' },
        { period: 7, subjectCode: '21CSS201T', room: 'IST411' },
        { period: 8, subjectCode: '21ECC201T', room: 'IST411' },
        { period: 9, subjectCode: '21ECC205T', room: 'IST411' }
      ],
      Friday: [
        { period: 1, subjectCode: '21PDM201L', room: 'H-TB-106' },
        { period: 2, subjectCode: '21PDM201L', room: 'H-TB-106' },
        { period: 6, subjectCode: '21LEM201T', room: 'IST411' },
        { period: 7, subjectCode: '21MAB201T', room: 'IST411' },
        { period: 8, subjectCode: '21ECC201T', room: 'IST411' },
        { period: 9, subjectCode: '21CSS201T', room: 'IST411' }
      ]
    }
  },
  {
    id: 'III-BME',
    name: 'III BME',
    fullName: 'III Year B.Tech Biomedical Engineering',
    semester: 'Semester V',
    year: '3rd Year',
    department: 'Biomedical Engineering',
    venue: 'IST 211 / AN',
    coordinator: 'Dr. V.N. Senthilkumaran',
    subjects: [
      { code: '21MAB301T', name: 'Probability and Statistics', slot: 'A', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Dr. K. M. Karuppusamy', dept: 'Maths', color: '#6366F1' },
      { code: '21BMC302J', name: 'Microcontrollers and Its Application in Medicine', slot: 'B', credits: '3-0-2-4', weeklyClasses: 4, faculty: 'Dr. K. Vigneshwaran', dept: 'ECE', color: '#10B981' },
      { code: '21BMC301J', name: 'Biomedical Signal Processing', slot: 'C', credits: '3-0-2-4', weeklyClasses: 4, faculty: 'Dr. V.N. Senthilkumaran', dept: 'ECE', color: '#F59E0B' },
      { code: '21BME266T', name: 'Biometrics', slot: 'D', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. G. Gifta', dept: 'BME', color: '#EC4899' },
      { code: '21ECO103T', name: 'Modern Wireless Communication System', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. Vaishnavi', dept: 'ECE', color: '#8B5CF6' },
      { code: '21BMC303T', name: 'Principles of Medical Imaging', slot: 'F', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. N. Prasana Venkatesh', dept: 'BME', color: '#14B8A6' },
      { code: '21PDM301L', name: 'Analytical and Logical Thinking Skills', slot: 'G', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'CDC Faculty', dept: 'CDC', color: '#3B82F6' },
      { code: '21LEM301T', name: 'Indian Art Form', slot: 'H', credits: '1-0-0-0', weeklyClasses: 1, faculty: 'Dr. G. Gifta', dept: 'BME', color: '#F97316' },
      { code: '21GNP301L', name: 'Community Connect', slot: 'I', credits: '0-0-2-1', weeklyClasses: 2, faculty: 'Dr. Jencia / Venkatesh', dept: 'BME', color: '#06B6D4' },
      { code: '21BMC311L', name: 'MPMC & Bio DSP Laboratory', slot: 'LAB', credits: '0-0-4-2', weeklyClasses: 4, faculty: 'BME Lab Faculty', dept: 'BME', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21PDM301L', room: 'G-625' },
        { period: 2, subjectCode: '21PDM301L', room: 'G-625' },
        { period: 3, subjectCode: '21BMC311L', room: 'MPMC LAB-107' },
        { period: 4, subjectCode: '21BMC311L', room: 'MPMC LAB-107' },
        { period: 6, subjectCode: '21ECO103T', room: 'IST211' },
        { period: 7, subjectCode: '21BMC302J', room: 'IST211' },
        { period: 8, subjectCode: '21BMC303T', room: 'IST211' },
        { period: 9, subjectCode: '21LEM301T', room: 'IST211' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21BMC311L', room: 'BIO DSP LAB-108' },
        { period: 2, subjectCode: '21BMC311L', room: 'BIO DSP LAB-108' },
        { period: 3, subjectCode: '21PDM301L', room: 'G-625' },
        { period: 6, subjectCode: '21BMC301J', room: 'IST211' },
        { period: 7, subjectCode: '21BME266T', room: 'IST211' },
        { period: 8, subjectCode: '21MAB301T', room: 'IST211' },
        { period: 9, subjectCode: '21BMC302J', room: 'IST211' }
      ],
      Wednesday: [
        { period: 6, subjectCode: '21BMC301J', room: 'IST211' },
        { period: 7, subjectCode: '21MAB301T', room: 'IST211' },
        { period: 8, subjectCode: '21BMC303T', room: 'IST211' },
        { period: 9, subjectCode: '21BME266T', room: 'IST211' }
      ],
      Thursday: [
        { period: 4, subjectCode: '21GNP301L', room: 'I-108' },
        { period: 6, subjectCode: '21MAB301T', room: 'IST211' },
        { period: 7, subjectCode: '21BMC301J', room: 'IST211' },
        { period: 8, subjectCode: '21ECO103T', room: 'IST211' },
        { period: 9, subjectCode: '21BMC302J', room: 'IST211' }
      ],
      Friday: [
        { period: 1, subjectCode: '21GNP301L', room: 'I-108' },
        { period: 6, subjectCode: '21BMC303T', room: 'IST211' },
        { period: 7, subjectCode: '21MAB301T', room: 'IST211' },
        { period: 8, subjectCode: '21BME266T', room: 'IST211' },
        { period: 9, subjectCode: '21ECO103T', room: 'IST211' }
      ]
    }
  },
  {
    id: 'III-ECE-A',
    name: 'III ECE-A',
    fullName: 'III Year B.Tech ECE - Section A',
    semester: 'Semester V',
    year: '3rd Year',
    department: 'Electronics & Communication Engineering',
    venue: 'IST 518 / FN',
    coordinator: 'Dr. M. Manikandan',
    subjects: [
      { code: '21MAB302T', name: 'Discrete Mathematics', slot: 'A', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'New Faculty 3', dept: 'Maths', color: '#6366F1' },
      { code: '21ECC301P', name: 'Microprocessor, Microcontroller & Interfacing', slot: 'B', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Dr. M. Manikandan', dept: 'ECE', color: '#10B981' },
      { code: '21ECC303T', name: 'VLSI Design and Technology', slot: 'C', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. M. Jothi', dept: 'ECE', color: '#F59E0B' },
      { code: '21ECE468T', name: 'System and Network on Chip', slot: 'D', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. V. Manikandan', dept: 'ECE-DS', color: '#EC4899' },
      { code: '21CSO355T', name: 'Machine Learning for All', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. J. Jencia', dept: 'BME', color: '#8B5CF6' },
      { code: '21GNP301L', name: 'Community Connect', slot: 'F', credits: '0-0-2-1', weeklyClasses: 2, faculty: 'Dr. V. Rajesh / Bharathi', dept: 'ECE', color: '#14B8A6' },
      { code: '21PDM301L', name: 'Analytical and Logical Thinking Skills', slot: 'G', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'CDC Faculty', dept: 'CDC', color: '#3B82F6' },
      { code: '21LEM301T', name: 'Indian Art Form', slot: 'H', credits: '1-0-0-0', weeklyClasses: 1, faculty: 'Dr. K. Vigneshwaran', dept: 'ECE', color: '#F97316' },
      { code: '21ECC311L', name: 'VLSI Design / Microprocessor Laboratory', slot: 'LAB', credits: '0-0-4-2', weeklyClasses: 4, faculty: 'Dr. Jothi / Murugapandiyan', dept: 'ECE', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21CSO355T', room: 'IST518' },
        { period: 2, subjectCode: '21ECC301P', room: 'IST518' },
        { period: 3, subjectCode: '21ECC301P', room: 'IST518' },
        { period: 4, subjectCode: '21MAB302T', room: 'IST518' },
        { period: 6, subjectCode: '21PDM301L', room: 'G-625' },
        { period: 7, subjectCode: '21PDM301L', room: 'G-625' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21LEM301T', room: 'IST518' },
        { period: 2, subjectCode: '21ECE468T', room: 'IST518' },
        { period: 3, subjectCode: '21ECC301P', room: 'IST518' },
        { period: 4, subjectCode: '21ECC301P', room: 'B-Proj' },
        { period: 7, subjectCode: '21PDM301L', room: 'G-625' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21ECC303T', room: 'IST518' },
        { period: 2, subjectCode: '21MAB302T', room: 'IST518' },
        { period: 3, subjectCode: '21ECE468T', room: 'IST518' },
        { period: 4, subjectCode: '21GNP301L', room: 'IST518' },
        { period: 8, subjectCode: '21ECC311L', room: 'LAB-108/309' },
        { period: 9, subjectCode: '21ECC311L', room: 'LAB-108/309' }
      ],
      Thursday: [
        { period: 1, subjectCode: '21MAB302T', room: 'IST518' },
        { period: 2, subjectCode: '21CSO355T', room: 'IST518' },
        { period: 3, subjectCode: '21ECC303T', room: 'IST518' },
        { period: 4, subjectCode: '21GNP301L', room: 'IST518' }
      ],
      Friday: [
        { period: 1, subjectCode: '21ECE468T', room: 'IST518' },
        { period: 2, subjectCode: '21MAB302T', room: 'IST518' },
        { period: 3, subjectCode: '21CSO355T', room: 'IST518' },
        { period: 4, subjectCode: '21ECC303T', room: 'IST518' },
        { period: 6, subjectCode: '21ECC311L', room: 'LAB-108/309' },
        { period: 7, subjectCode: '21ECC311L', room: 'LAB-108/309' }
      ]
    }
  },
  {
    id: 'III-ECE-B',
    name: 'III ECE-B',
    fullName: 'III Year B.Tech ECE - Section B',
    semester: 'Semester V',
    year: '3rd Year',
    department: 'Electronics & Communication Engineering',
    venue: 'IST 518 / AN',
    coordinator: 'Mrs. B. Abirami',
    subjects: [
      { code: '21MAB302T', name: 'Discrete Mathematics', slot: 'A', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Dr. M. Thanga Rejini', dept: 'Maths', color: '#6366F1' },
      { code: '21ECC301P', name: 'Microprocessor, Microcontroller & Interfacing', slot: 'B', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Mrs. B. Abirami', dept: 'ECE', color: '#10B981' },
      { code: '21ECC303T', name: 'VLSI Design and Technology', slot: 'C', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. R. Vinoth Raj', dept: 'ECE-DS', color: '#F59E0B' },
      { code: '21ECE468T', name: 'System and Network on Chip', slot: 'D', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. V. Manikandan', dept: 'ECE-DS', color: '#EC4899' },
      { code: '21CSO355T', name: 'Machine Learning for All', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. J. Jencia', dept: 'BME', color: '#8B5CF6' },
      { code: '21GNP301L', name: 'Community Connect', slot: 'F', credits: '0-0-2-1', weeklyClasses: 2, faculty: 'Dr. H. Sudharsan / Swetha', dept: 'ECE', color: '#14B8A6' },
      { code: '21PDM301L', name: 'Analytical and Logical Thinking Skills', slot: 'G', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'CDC Faculty', dept: 'CDC', color: '#3B82F6' },
      { code: '21LEM301T', name: 'Indian Art Form', slot: 'H', credits: '1-0-0-0', weeklyClasses: 1, faculty: 'Dr. A. Anand', dept: 'ECE', color: '#F97316' },
      { code: '21ECC311L', name: 'VLSI Design / Microprocessor Laboratory', slot: 'LAB', credits: '0-0-4-2', weeklyClasses: 4, faculty: 'Dr. Sreenivasa Rao / Venkatesh', dept: 'ECE', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21ECC311L', room: 'LAB-108/309' },
        { period: 2, subjectCode: '21ECC311L', room: 'LAB-108/309' },
        { period: 6, subjectCode: '21CSO355T', room: 'IST518' },
        { period: 7, subjectCode: '21ECC301P', room: 'IST518' },
        { period: 8, subjectCode: '21MAB302T', room: 'IST518' },
        { period: 9, subjectCode: '21ECE468T', room: 'IST518' }
      ],
      Tuesday: [
        { period: 2, subjectCode: '21PDM301L', room: 'G-625' },
        { period: 6, subjectCode: '21GNP301L', room: 'IST518' },
        { period: 7, subjectCode: '21ECC301P', room: 'IST518' },
        { period: 8, subjectCode: '21ECE468T', room: 'IST518' },
        { period: 9, subjectCode: '21ECC303T', room: 'IST518' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21PDM301L', room: 'G-625' },
        { period: 6, subjectCode: '21ECC301P', room: 'B-Proj' },
        { period: 7, subjectCode: '21ECC301P', room: 'IST518' },
        { period: 8, subjectCode: '21MAB302T', room: 'IST518' },
        { period: 9, subjectCode: '21LEM301T', room: 'IST518' }
      ],
      Thursday: [
        { period: 1, subjectCode: '21ECC311L', room: 'LAB-108/309' },
        { period: 2, subjectCode: '21ECC311L', room: 'LAB-108/309' },
        { period: 6, subjectCode: '21MAB302T', room: 'IST518' },
        { period: 7, subjectCode: '21ECC303T', room: 'IST518' },
        { period: 8, subjectCode: '21CSO355T', room: 'IST518' },
        { period: 9, subjectCode: '21GNP301L', room: 'IST518' }
      ],
      Friday: [
        { period: 6, subjectCode: '21ECC303T', room: 'IST518' },
        { period: 7, subjectCode: '21MAB302T', room: 'IST518' },
        { period: 8, subjectCode: '21CSO355T', room: 'IST518' },
        { period: 9, subjectCode: '21ECE468T', room: 'IST518' }
      ]
    }
  },
  {
    id: 'III-ECE-DS',
    name: 'III ECE-DS',
    fullName: 'III Year B.Tech ECE (Data Science)',
    semester: 'Semester V',
    year: '3rd Year',
    department: 'ECE (Data Science)',
    venue: 'IST 519 / FN',
    coordinator: 'Dr. Saraswathi S',
    subjects: [
      { code: '21MAB302T', name: 'Discrete Mathematics', slot: 'A', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'New Faculty 2', dept: 'Maths', color: '#6366F1' },
      { code: '21ECC301P', name: 'Microprocessor, Microcontroller & Interfacing', slot: 'B', credits: '3-1-0-4', weeklyClasses: 4, faculty: 'Mrs. B. Abirami', dept: 'ECE', color: '#10B981' },
      { code: '21ECC303T', name: 'VLSI Design and Technology', slot: 'C', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. R. Vinoth Raj', dept: 'ECE-DS', color: '#F59E0B' },
      { code: '21CSO355T', name: 'Machine Learning for All', slot: 'D', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. Chitra Devi', dept: 'SoC', color: '#EC4899' },
      { code: '21ECE371T', name: 'Database Design and Management', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. S. Saraswathi', dept: 'SoC', color: '#8B5CF6' },
      { code: '21GNP301L', name: 'Community Connect', slot: 'F', credits: '0-0-2-1', weeklyClasses: 2, faculty: 'Dr. S. Jeevanantham', dept: 'ECE-DS', color: '#14B8A6' },
      { code: '21PDM301L', name: 'Analytical and Logical Thinking Skills', slot: 'G', credits: '0-0-2-0', weeklyClasses: 2, faculty: 'CDC Faculty', dept: 'CDC', color: '#3B82F6' },
      { code: '21LEM301T', name: 'Indian Art Form', slot: 'H', credits: '1-0-0-0', weeklyClasses: 1, faculty: 'Dr. Prabin Kumar Bera', dept: 'ECE', color: '#F97316' },
      { code: '21ECC311L', name: 'VLSI Design / Microprocessor Laboratory', slot: 'LAB', credits: '0-0-4-2', weeklyClasses: 4, faculty: 'Dr. Vinothraj / Bhuvaneshwari', dept: 'ECE-DS', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21ECE371T', room: 'IST519' },
        { period: 2, subjectCode: '21ECC301P', room: 'IST519' },
        { period: 3, subjectCode: '21ECC303T', room: 'IST519' },
        { period: 4, subjectCode: '21MAB302T', room: 'IST519' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21ECC303T', room: 'IST519' },
        { period: 2, subjectCode: '21ECC301P', room: 'IST519' },
        { period: 3, subjectCode: '21CSO355T', room: 'IST519' },
        { period: 4, subjectCode: '21GNP301L', room: 'IST519' },
        { period: 6, subjectCode: '21ECC311L', room: 'LAB-108/107' },
        { period: 7, subjectCode: '21ECC311L', room: 'LAB-108/107' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21LEM301T', room: 'IST519' },
        { period: 2, subjectCode: '21ECC301P', room: 'IST519' },
        { period: 3, subjectCode: '21MAB302T', room: 'IST519' },
        { period: 4, subjectCode: '21ECC303T', room: 'IST519' },
        { period: 9, subjectCode: '21PDM301L', room: 'G-625' }
      ],
      Thursday: [
        { period: 1, subjectCode: '21MAB302T', room: 'IST519' },
        { period: 2, subjectCode: '21CSO355T', room: 'IST519' },
        { period: 3, subjectCode: '21ECE371T', room: 'IST519' },
        { period: 4, subjectCode: '21GNP301L', room: 'IST519' }
      ],
      Friday: [
        { period: 1, subjectCode: '21CSO355T', room: 'IST519' },
        { period: 2, subjectCode: '21MAB302T', room: 'IST519' },
        { period: 3, subjectCode: '21ECE371T', room: 'IST519' },
        { period: 4, subjectCode: '21ECC301P', room: 'B-Proj' },
        { period: 6, subjectCode: '21PDM301L', room: 'G-625' },
        { period: 8, subjectCode: '21ECC311L', room: 'LAB-108/107' },
        { period: 9, subjectCode: '21ECC311L', room: 'LAB-108/107' }
      ]
    }
  },
  {
    id: 'IV-ECE-A',
    name: 'IV ECE-A',
    fullName: 'IV Year B.Tech ECE - Section A',
    semester: 'Semester VII',
    year: '4th Year',
    department: 'Electronics & Communication Engineering',
    venue: 'IST 225',
    coordinator: 'Dr. A. Anand',
    subjects: [
      { code: '21GNH401T', name: 'Behavioural Psychology', slot: 'A', credits: '2-1-0-3', weeklyClasses: 3, faculty: 'Dr. A. Anand', dept: 'ECE', color: '#6366F1' },
      { code: '21ECC401T', name: 'Wireless Communication and Antenna Systems', slot: 'B', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. K. Vigneshwaran', dept: 'ECE', color: '#10B981' },
      { code: '21ECC402P', name: 'Computer Communication and Network Security', slot: 'C', credits: '2-1-0-3', weeklyClasses: 3, faculty: 'Dr. S. Jeevanantham', dept: 'ECE-DS', color: '#F59E0B' },
      { code: '21ECE461T', name: 'Semiconductor Memory Design', slot: 'D', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. H. SriBhuvaneshwari', dept: 'ECE', color: '#EC4899' },
      { code: '21ECE463T', name: 'Scripting Language for Electronic Design Automation', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. Sreenivasa Rao Ijada', dept: 'ECE', color: '#8B5CF6' },
      { code: '21CSO355T', name: 'Machine Learning for All', slot: 'F', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. N. Prasanna Venkatesh', dept: 'BME', color: '#14B8A6' },
      { code: '21ECC402L', name: 'CCNS Laboratory', slot: 'LAB', credits: '2-1-0-3', weeklyClasses: 2, faculty: 'Mrs. T. Swetha', dept: 'ECE', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21ECC402P', room: 'IST225' },
        { period: 3, subjectCode: '21GNH401T', room: 'IST225' },
        { period: 4, subjectCode: '21ECE461T', room: 'IST225' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21ECC402P', room: 'IST225' },
        { period: 2, subjectCode: '21ECE461T', room: 'IST225' },
        { period: 3, subjectCode: '21ECC401T', room: 'IST225' },
        { period: 4, subjectCode: '21CSO355T', room: 'IST225' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21ECC401T', room: 'IST225' },
        { period: 2, subjectCode: '21ECC402L', room: 'LAB-IST 108' },
        { period: 3, subjectCode: '21ECE463T', room: 'IST225' },
        { period: 4, subjectCode: '21CSO355T', room: 'IST225' }
      ],
      Thursday: [
        { period: 1, subjectCode: '21CSO355T', room: 'IST225' },
        { period: 2, subjectCode: '21GNH401T', room: 'IST225' },
        { period: 3, subjectCode: '21ECE463T', room: 'IST225' },
        { period: 4, subjectCode: '21ECC401T', room: 'IST225' }
      ],
      Friday: [
        { period: 1, subjectCode: '21ECC402P', room: 'IST225' },
        { period: 2, subjectCode: '21GNH401T', room: 'IST225' },
        { period: 3, subjectCode: '21ECE461T', room: 'IST225' },
        { period: 4, subjectCode: '21ECE463T', room: 'IST225' }
      ]
    }
  },
  {
    id: 'IV-ECE-B',
    name: 'IV ECE-B',
    fullName: 'IV Year B.Tech ECE - Section B',
    semester: 'Semester VII',
    year: '4th Year',
    department: 'Electronics & Communication Engineering',
    venue: 'IST 227',
    coordinator: 'Dr. R. Rajasekar',
    subjects: [
      { code: '21GNH401T', name: 'Behavioural Psychology', slot: 'A', credits: '2-1-0-3', weeklyClasses: 3, faculty: 'Dr. A. Annand', dept: 'ECE', color: '#6366F1' },
      { code: '21ECC401T', name: 'Wireless Communication and Antenna Systems', slot: 'B', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. K. Vigneshwaran', dept: 'ECE', color: '#10B981' },
      { code: '21ECC402P', name: 'Computer Communication and Network Security', slot: 'C', credits: '2-1-0-3', weeklyClasses: 3, faculty: 'Dr. R. Rajasekar', dept: 'ECE-DS', color: '#F59E0B' },
      { code: '21ECE461T', name: 'Semiconductor Memory Design', slot: 'D', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. H. SriBhuvaneshwari', dept: 'ECE', color: '#EC4899' },
      { code: '21ECE463T', name: 'Scripting Language for Electronic Design Automation', slot: 'E', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. Sreenivasa Rao Ijada', dept: 'ECE', color: '#8B5CF6' },
      { code: '21CSO355T', name: 'Machine Learning for All', slot: 'F', credits: '3-0-0-3', weeklyClasses: 3, faculty: 'Dr. N. Prasanna Venkatesh', dept: 'BME', color: '#14B8A6' },
      { code: '21ECC402L', name: 'CCNS Laboratory', slot: 'LAB', credits: '2-1-0-3', weeklyClasses: 2, faculty: 'Ms. T. Swetha', dept: 'ECE', color: '#EF4444' }
    ],
    schedule: {
      Monday: [
        { period: 1, subjectCode: '21ECC402P', room: 'IST227' },
        { period: 2, subjectCode: '21GNH401T', room: 'IST227' },
        { period: 3, subjectCode: '21ECE463T', room: 'IST227' },
        { period: 4, subjectCode: '21CSO355T', room: 'IST227' }
      ],
      Tuesday: [
        { period: 1, subjectCode: '21ECC402P', room: 'IST227' },
        { period: 2, subjectCode: '21ECE463T', room: 'IST227' },
        { period: 3, subjectCode: '21CSO355T', room: 'IST227' },
        { period: 4, subjectCode: '21ECC401T', room: 'IST227' }
      ],
      Wednesday: [
        { period: 1, subjectCode: '21ECC402P', room: 'IST227' },
        { period: 2, subjectCode: '21ECE461T', room: 'IST227' },
        { period: 3, subjectCode: '21GNH401T', room: 'IST227' },
        { period: 4, subjectCode: '21ECC401T', room: 'IST227' }
      ],
      Thursday: [
        { period: 1, subjectCode: '21ECE461T', room: 'IST227' },
        { period: 2, subjectCode: '21ECC401T', room: 'IST227' },
        { period: 3, subjectCode: '21ECC402L', room: 'LAB-IST 108' },
        { period: 4, subjectCode: '21GNH401T', room: 'IST227' }
      ],
      Friday: [
        { period: 1, subjectCode: '21ECE463T', room: 'IST227' },
        { period: 2, subjectCode: '21ECE461T', room: 'IST227' },
        { period: 3, subjectCode: '21CSO355T', room: 'IST227' }
      ]
    }
  }
];
