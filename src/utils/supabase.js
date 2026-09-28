// Supabase client singleton
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || '';
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect placeholder / unfilled values
const isRealURL = SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('YOUR_PROJECT');
const isRealKey = SUPABASE_KEY.length > 20 && !SUPABASE_KEY.includes('YOUR_ANON');

export const isSupabaseConfigured = isRealURL && isRealKey;

// Only create client when credentials are real
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/**
 * Test Supabase connectivity and verify database tables.
 * @returns {{ connected: boolean, configured: boolean, message: string }}
 */
export async function testSupabaseConnection() {
  if (!supabase) {
    return {
      connected: false,
      configured: false,
      message: 'Supabase credentials not configured in .env.local (Running in Demo Mode)'
    };
  }
  try {
    const { error } = await supabase.from('students').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return {
      connected: true,
      configured: true,
      message: '🟢 Successfully connected to Supabase database!'
    };
  } catch (err) {
    console.warn('Supabase test connection failed:', err);
    return {
      connected: false,
      configured: true,
      message: `Database connection error: ${err.message || 'Check database schema & RLS policies'}`
    };
  }
}

/**
 * Authenticate student by register_no + password.
 * Queries Supabase 'students' and 'attendance' tables.
 * Falls back to demo account if offline or Supabase connection fails.
 *
 * @returns {{ student, attendanceRows, error }}
 */
export async function loginStudent(registerNo, password) {
  const cleanReg = registerNo.trim().toUpperCase();
  const cleanPwd = password.trim();

  if (!supabase) {
    // ─── Demo mode: no Supabase configured ───
    return demoLogin(cleanReg, cleanPwd);
  }

  try {
    // 1. Fetch student by register number
    const { data: students, error: fetchErr } = await supabase
      .from('students')
      .select('*')
      .eq('register_no', cleanReg)
      .limit(1);

    if (fetchErr) throw fetchErr;

    if (!students || students.length === 0) {
      // Check if user entered a built-in demo account
      const demoResult = demoLogin(cleanReg, cleanPwd);
      if (!demoResult.error) return demoResult;
      return { error: 'Student not found in database. Check your Register Number or use demo credentials (DEMO / demo).' };
    }

    const student = students[0];

    // 2. Verify password
    if (student.password_hash !== cleanPwd) {
      return { error: 'Incorrect password. Please try again.' };
    }

    // 3. Fetch attendance records
    const { data: attendanceRows, error: attErr } = await supabase
      .from('attendance')
      .select('*')
      .eq('register_no', cleanReg);

    if (attErr) throw attErr;

    return { student, attendanceRows: attendanceRows || [] };

  } catch (err) {
    console.warn('Supabase login error, falling back to demo mode if applicable:', err);
    // Graceful fallback to demo data if the DB has network / schema issues
    const demoResult = demoLogin(cleanReg, cleanPwd);
    if (!demoResult.error) {
      console.info('Authenticated using offline demo dataset');
      return demoResult;
    }
    return { error: `Database error: ${err.message || 'Connection failed. Verify Supabase credentials and run database/supabase_master_setup.sql.'}` };
  }
}

/**
 * Fetch timetable records from Supabase for a given section/department.
 */
export async function fetchTimetableRecords(section) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('timetable_records')
      .select('*')
      .ilike('section', `%${section}%`);
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Failed to fetch timetable records from Supabase:', e);
    return null;
  }
}

/**
 * Update a student's attendance data in the database.
 */
export async function saveAttendance(registerNo, subjectCode, attended, total) {
  if (!supabase) return { error: 'Not configured' };
  try {
    const { error } = await supabase
      .from('attendance')
      .upsert({
        register_no: registerNo,
        subject_code: subjectCode,
        attended,
        total,
        as_of_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      }, { onConflict: 'register_no,subject_code' });
    return { error };
  } catch (e) {
    return { error: e.message };
  }
}

// ─── Demo mode: hardcoded test accounts (no Supabase needed) ───
const DEMO_STUDENTS = [
  {
    register_no: '21BCE0001',
    name: 'Aarav Sharma',
    section_id: 'I-ECE-A',
    department: 'Electronics & Communication Engineering',
    year: '1st Year',
    password_hash: 'password123',
  },
  {
    register_no: '21BCE0002',
    name: 'Priya Nair',
    section_id: 'I-ECE-A',
    department: 'Electronics & Communication Engineering',
    year: '1st Year',
    password_hash: 'demo',
  },
  {
    register_no: 'DEMO',
    name: 'Demo Student',
    section_id: 'I-ECE-A',
    department: 'Electronics & Communication Engineering',
    year: '1st Year',
    password_hash: 'demo',
  },
];

const DEMO_ATTENDANCE = {
  '21BCE0001': [
    { subject_code: '21MAB102T', subject_name: 'Advanced Calculus and Complex Analysis', attended: 18, total: 22 },
    { subject_code: '21CYB101J', subject_name: 'Chemistry', attended: 25, total: 30 },
    { subject_code: '21BTB102J', subject_name: 'Electronic System and PCB Design', attended: 8, total: 12 },
    { subject_code: '21CSS101J', subject_name: 'Programming for Problem Solving', attended: 20, total: 25 },
    { subject_code: '21GNH101J', subject_name: 'Philosophy of Engineering', attended: 12, total: 16 },
    { subject_code: '21BTB103T', subject_name: 'Biology', attended: 7, total: 10 },
    { subject_code: '21LEH104T', subject_name: 'German Language', attended: 14, total: 18 },
    { subject_code: '21MES101L', subject_name: 'Basic Civil and Mechanical Workshop', attended: 16, total: 20 },
    { subject_code: '21PDM102L', subject_name: 'General Aptitude (CDC)', attended: 8, total: 12 },
    { subject_code: '21GNM102L', subject_name: 'NSS / Social Outreach', attended: 6, total: 10 },
  ],
};

function demoLogin(registerNo, password) {
  const reg = registerNo.trim().toUpperCase();
  const student = DEMO_STUDENTS.find(s => s.register_no === reg);
  if (!student) return { error: 'Student not found. Use a demo account (DEMO / demo).' };
  if (student.password_hash !== password) return { error: 'Incorrect password.' };
  const attendanceRows = DEMO_ATTENDANCE[reg] || DEMO_ATTENDANCE['21BCE0001'];
  return { student, attendanceRows };
}
