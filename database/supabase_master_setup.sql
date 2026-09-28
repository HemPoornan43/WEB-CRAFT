-- ==============================================================================
-- ATTENDANCE PREDICTOR - SUPABASE MASTER SETUP SCRIPT
-- Run this ENTIRE script in your Supabase project's SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create STUDENTS table (for authentication & section mapping)
CREATE TABLE IF NOT EXISTS public.students (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    register_no   TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    section_id    TEXT NOT NULL,
    department    TEXT,
    year          TEXT,
    email         TEXT UNIQUE,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create ATTENDANCE table (per-subject attendance per student)
CREATE TABLE IF NOT EXISTS public.attendance (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id    UUID REFERENCES public.students(id) ON DELETE CASCADE,
    register_no   TEXT NOT NULL,
    subject_code  TEXT NOT NULL,
    subject_name  TEXT NOT NULL,
    attended      INTEGER DEFAULT 0,
    total         INTEGER DEFAULT 0,
    percentage    NUMERIC(5,2) GENERATED ALWAYS AS (
                    CASE WHEN total > 0 THEN ROUND((attended::NUMERIC / total) * 100, 2) ELSE 0 END
                  ) STORED,
    as_of_date    DATE DEFAULT CURRENT_DATE,
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (register_no, subject_code)
);

-- 3. Row Level Security (RLS) for Students & Attendance
ALTER TABLE public.students   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read students" ON public.students;
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read attendance" ON public.attendance;
CREATE POLICY "Allow public read attendance" ON public.attendance FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public write attendance" ON public.attendance;
CREATE POLICY "Allow public write attendance" ON public.attendance FOR ALL USING (true);

-- 4. Seed Test Student Accounts (Multi-Scenario Test Data)
INSERT INTO public.students (register_no, name, section_id, department, year, email, password_hash)
VALUES
  -- Scenario 1: Distinction Zone (92.6% · 20+ Safe Bunks)
  ('21ECE101', 'Aditya Raman', 'I-ECE-A', 'Electronics & Communication Engineering', '1st Year', 'aditya.raman@student.srm.edu', 'pass123'),

  -- Scenario 2: Danger Zone / Detention Risk (< 75% · Urgent Recovery)
  ('22BME202', 'Kavya Sundaram', 'II-BME', 'Biomedical Engineering / SEEE', '2nd Year', 'kavya.sundaram@student.srm.edu', 'pass123'),

  -- Scenario 3: Standard / Balanced Demo Account
  ('DEMO', 'Aarav Sharma', 'I-ECE-A', 'Electronics & Communication Engineering', '1st Year', 'demo@student.edu', 'demo'),
  ('21BCE0001', 'Aarav Sharma', 'I-ECE-A', 'Electronics & Communication Engineering', '1st Year', 'aarav@test.com', 'password123'),
  ('21BCE0002', 'Priya Nair', 'I-ECE-A', 'Electronics & Communication Engineering', '1st Year', 'priya@test.com', 'demo'),
  ('21BCE0003', 'Rahul Verma', 'I-ECE-B', 'Electronics & Communication Engineering', '1st Year', 'rahul@test.com', 'password123'),
  ('21BCE0004', 'Sneha Patel', 'I-ECE-A', 'Electronics & Communication Engineering', '1st Year', 'sneha@test.com', 'password123')
ON CONFLICT (register_no) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  section_id = EXCLUDED.section_id;

-- 5. Seed Attendance Data for Students

-- 5a. Seed Distinction Attendance for 21ECE101 (Overall 92.57% · Safe Buffer)
INSERT INTO public.attendance (student_id, register_no, subject_code, subject_name, attended, total, as_of_date)
SELECT s.id, s.register_no, sub.code, sub.name, sub.attended, sub.total, CURRENT_DATE
FROM public.students s,
(VALUES
  ('21MAB102T', 'Advanced Calculus and Complex Analysis', 21, 22),
  ('21CYB101J', 'Chemistry', 28, 30),
  ('21BTB102J', 'Electronic System and PCB Design', 11, 12),
  ('21CSS101J', 'Programming for Problem Solving', 24, 25),
  ('21GNH101J', 'Philosophy of Engineering', 15, 16),
  ('21BTB103T', 'Biology', 9, 10),
  ('21LEH104T', 'German Language', 16, 18),
  ('21MES101L', 'Basic Civil and Mechanical Workshop', 19, 20),
  ('21PDM102L', 'General Aptitude (CDC)', 10, 12),
  ('21GNM102L', 'NSS / Social Outreach', 9, 10)
) AS sub(code, name, attended, total)
WHERE s.register_no = '21ECE101'
ON CONFLICT (register_no, subject_code) DO UPDATE SET
  attended = EXCLUDED.attended,
  total = EXCLUDED.total;

-- 5b. Seed Danger Zone Attendance for 22BME202 (Overall 68.60% · < 75% Detention Risk)
INSERT INTO public.attendance (student_id, register_no, subject_code, subject_name, attended, total, as_of_date)
SELECT s.id, s.register_no, sub.code, sub.name, sub.attended, sub.total, CURRENT_DATE
FROM public.students s,
(VALUES
  ('21MAB201T', 'Transforms and Boundary Value Problems', 14, 22),
  ('21BMC202T', 'Biomedical Signals and Systems', 12, 18),
  ('21BMC203J', 'Electric and Electronic Circuits', 16, 24),
  ('21BMC204J', 'Digital Logic for Medical Systems', 13, 18),
  ('21PYS202T', 'Medical Physics', 12, 18),
  ('21LEM201T', 'Professional Ethics', 4, 6),
  ('21LEM202T', 'Universal Human Values-II', 14, 18),
  ('21PDM201L', 'Verbal Reasoning (CDC)', 7, 12),
  ('21PDH201T', 'Social Engineering', 9, 12),
  ('21BMC205L', 'DLMS & Circuit Laboratory', 17, 24)
) AS sub(code, name, attended, total)
WHERE s.register_no = '22BME202'
ON CONFLICT (register_no, subject_code) DO UPDATE SET
  attended = EXCLUDED.attended,
  total = EXCLUDED.total;

-- 5c. Seed Standard Attendance for DEMO / 21BCE0001 (Overall 79.43% · Balanced)
INSERT INTO public.attendance (student_id, register_no, subject_code, subject_name, attended, total, as_of_date)
SELECT s.id, s.register_no, sub.code, sub.name, sub.attended, sub.total, CURRENT_DATE
FROM public.students s,
(VALUES
  ('21MAB102T', 'Advanced Calculus and Complex Analysis', 18, 22),
  ('21CYB101J', 'Chemistry', 25, 30),
  ('21BTB102J', 'Electronic System and PCB Design', 8, 12),
  ('21CSS101J', 'Programming for Problem Solving', 20, 25),
  ('21GNH101J', 'Philosophy of Engineering', 12, 16),
  ('21BTB103T', 'Biology', 7, 10),
  ('21LEH104T', 'German Language', 14, 18),
  ('21MES101L', 'Basic Civil and Mechanical Workshop', 16, 20),
  ('21PDM102L', 'General Aptitude (CDC)', 8, 12),
  ('21GNM102L', 'NSS / Social Outreach', 6, 10)
) AS sub(code, name, attended, total)
WHERE s.register_no IN ('DEMO', '21BCE0001', '21BCE0002')
ON CONFLICT (register_no, subject_code) DO UPDATE SET
  attended = EXCLUDED.attended,
  total = EXCLUDED.total;

-- ==============================================================================
-- 6. TIMETABLE RECORDS & SCHEDULES
-- ==============================================================================

-- ==============================================================================
-- SUPABASE MASTER TIMETABLE DATA SCRIPT (YEARS 1, 2, 3, 4)
-- Institution: SRM Institute of Science and Technology, Tiruchirappalli Campus
-- Faculty of Engineering and Technology
-- ==============================================================================

-- 1. Create table public.timetable_records matching exact requested fields
CREATE TABLE IF NOT EXISTS public.timetable_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    section TEXT NOT NULL,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    total_no_of_hours INTEGER NOT NULL DEFAULT 0, -- Calculated as credits * 12
    semester TEXT NOT NULL,
    timetable JSONB NOT NULL DEFAULT '[]'::jsonb,
    semester_start_date DATE,
    semester_end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_timetable_department ON public.timetable_records(department);
CREATE INDEX IF NOT EXISTS idx_timetable_year_sec ON public.timetable_records(year, section);
CREATE INDEX IF NOT EXISTS idx_timetable_course_code ON public.timetable_records(course_code);
CREATE INDEX IF NOT EXISTS idx_timetable_semester ON public.timetable_records(semester);
CREATE INDEX IF NOT EXISTS idx_timetable_gin ON public.timetable_records USING gin (timetable);

-- 3. Trigger: Automatically calculate total_no_of_hours = credits * 12
CREATE OR REPLACE FUNCTION public.calculate_timetable_hours()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_no_of_hours := COALESCE(NEW.credits, 0) * 12;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_timetable_hours ON public.timetable_records;

CREATE TRIGGER trigger_calculate_timetable_hours
BEFORE INSERT OR UPDATE ON public.timetable_records
FOR EACH ROW
EXECUTE FUNCTION public.calculate_timetable_hours();

-- 4. Row Level Security (RLS)
ALTER TABLE public.timetable_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on timetable_records" ON public.timetable_records;
CREATE POLICY "Allow public read access on timetable_records" 
ON public.timetable_records FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow authenticated users full access on timetable_records" ON public.timetable_records;
CREATE POLICY "Allow authenticated users full access on timetable_records" 
ON public.timetable_records FOR ALL TO authenticated USING (true);

-- 5. Insert rows
INSERT INTO public.timetable_records (
    department,
    year,
    section,
    course_code,
    course_name,
    credits,
    total_no_of_hours,
    semester,
    timetable,
    semester_start_date,
    semester_end_date
) VALUES
('Electronics and Communication Engineering', '1', 'ECE-A', '21LEH104T', 'German', 3, 36, 'Odd Semester (2024-25)', '[{"day": "Thursday", "period": "1, 2, 3", "time": "09:00 - 11:40", "room": "IST602", "type": "Theory/Tutorial"}, {"day": "Friday", "period": "7, 8", "time": "02:25 - 04:10", "room": "IST626", "type": "Theory/Tutorial"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21GNH101J', 'Philosophy of Engineering', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST602", "slot": "E"}, {"day": "Wednesday", "period": "2", "time": "09:55 - 10:45", "room": "IST602", "slot": "E"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21MAB102T', 'Advanced Calculus and Complex Analysis', 4, 48, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "4", "time": "11:45 - 12:35", "room": "IST602", "slot": "A"}, {"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST602", "slot": "A"}, {"day": "Thursday", "period": "4", "time": "11:45 - 12:35", "room": "IST602", "slot": "A"}, {"day": "Friday", "period": "2", "time": "09:55 - 10:45", "room": "IST602", "slot": "A"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21CYB101J', 'Chemistry', 5, 60, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "3", "time": "10:50 - 11:40", "room": "IST602", "slot": "B"}, {"day": "Monday", "period": "6, 7", "time": "01:30 - 03:15", "room": "Che lab", "slot": "Lab"}, {"day": "Tuesday", "period": "2", "time": "09:55 - 10:45", "room": "IST602", "slot": "B"}, {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST602", "slot": "B"}, {"day": "Friday", "period": "4", "time": "11:45 - 12:35", "room": "IST602", "slot": "B"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21BTB102J', 'Electronic System and PCB Design', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Tuesday", "period": "1", "time": "09:00 - 09:50", "room": "IST602", "slot": "C"}, {"day": "Wednesday", "period": "8, 9", "time": "03:20 - 05:05", "room": "IST 108", "slot": "PCB Lab"}, {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST602", "slot": "C"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21CSS101J', 'Programming for Problem Solving', 4, 48, 'Odd Semester (2024-25)', '[{"day": "Tuesday", "period": "4", "time": "11:45 - 12:35", "room": "IST602", "slot": "D"}, {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST602", "slot": "D"}, {"day": "Wednesday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST 618", "slot": "PPS LAB"}, {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST602", "slot": "D"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21MES101L', 'Basic Civil and Mechanical Workshop', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Tuesday", "period": "6, 7, 8", "time": "01:30 - 04:10", "room": "IST 20,21", "slot": "Workshop"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21PDM102L', 'General Aptitude', 0, 0, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "9", "time": "04:15 - 05:05", "room": "IST710", "slot": "CDC"}, {"day": "Thursday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST510", "slot": "CDC"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21GNM102L', 'NSS', 0, 0, 'Odd Semester (2024-25)', '[{"day": "Thursday", "period": "8, 9", "time": "03:20 - 05:05", "room": "IST201", "slot": "NSS"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering', '1', 'ECE-A', '21BTB103T', 'Biology', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "8", "time": "03:20 - 04:10", "room": "IST710", "slot": "F"}, {"day": "Friday", "period": "6", "time": "01:30 - 02:20", "room": "IST602", "slot": "F"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21LEH104T', 'German', 3, 36, 'Odd Semester (2024-25)', '[{"day": "Thursday", "period": "7, 8", "time": "02:25 - 04:10", "room": "IST602", "slot": "German"}, {"day": "Friday", "period": "6", "time": "01:30 - 02:20", "room": "IST626", "slot": "German"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21GNH101J', 'Philosophy of Engineering', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST602", "slot": "E"}, {"day": "Wednesday", "period": "8", "time": "03:20 - 04:10", "room": "IST602", "slot": "E"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21MAB102T', 'Advanced Calculus and Complex Analysis', 4, 48, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "9", "time": "04:15 - 05:05", "room": "IST602", "slot": "A"}, {"day": "Tuesday", "period": "8", "time": "03:20 - 04:10", "room": "IST602", "slot": "A"}, {"day": "Thursday", "period": "4", "time": "11:45 - 12:35", "room": "IST710", "slot": "A"}, {"day": "Friday", "period": "9", "time": "04:15 - 05:05", "room": "IST602", "slot": "A"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21CYB101J', 'Chemistry', 5, 60, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "3, 4", "time": "10:50 - 12:35", "room": "Che lab", "slot": "Lab"}, {"day": "Monday", "period": "8", "time": "03:20 - 04:10", "room": "IST602", "slot": "B"}, {"day": "Tuesday", "period": "7", "time": "02:25 - 03:15", "room": "IST602", "slot": "B"}, {"day": "Wednesday", "period": "7", "time": "02:25 - 03:15", "room": "IST602", "slot": "B"}, {"day": "Friday", "period": "8", "time": "03:20 - 04:10", "room": "IST602", "slot": "B"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21BTB102J', 'Electronic System and PCB Design (for ECE)', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "2", "time": "09:55 - 10:45", "room": "IST710", "slot": "F"}, {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST710", "slot": "F"}, {"day": "Friday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST 617", "slot": "PCB Lab"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21EEC101J', 'Electrical Circuits (for EEE)', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "2", "time": "09:55 - 10:45", "room": "IST520", "slot": "G"}, {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST520", "slot": "G"}, {"day": "Friday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST 617", "slot": "EC Lab"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21CSS101J', 'Programming for Problem Solving', 4, 48, 'Odd Semester (2024-25)', '[{"day": "Tuesday", "period": "9", "time": "04:15 - 05:05", "room": "IST602", "slot": "D"}, {"day": "Wednesday", "period": "2", "time": "09:55 - 10:45", "room": "IST 617", "slot": "PPS Lab"}, {"day": "Wednesday", "period": "6", "time": "01:30 - 02:20", "room": "IST618", "slot": "PPS LAB"}, {"day": "Wednesday", "period": "9", "time": "04:15 - 05:05", "room": "IST602", "slot": "D"}, {"day": "Thursday", "period": "6", "time": "01:30 - 02:20", "room": "IST602", "slot": "D"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21MES101L', 'Basic Civil and Mechanical Workshop', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Tuesday", "period": "1, 2, 3, 4", "time": "09:00 - 12:35", "room": "IST 20,21", "slot": "Workshop"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21PDM102L', 'General Aptitude', 0, 0, 'Odd Semester (2024-25)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST609", "slot": "CDC"}, {"day": "Wednesday", "period": "3, 4", "time": "10:50 - 12:35", "room": "IST510", "slot": "CDC"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21GNM102L', 'NSS', 0, 0, 'Odd Semester (2024-25)', '[{"day": "Thursday", "period": "1, 2", "time": "09:00 - 10:45", "room": "201", "slot": "NSS"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering / Electrical and Electronics Engineering', '1', 'ECE-B & EEE', '21BTB103T', 'Biology', 2, 24, 'Odd Semester (2024-25)', '[{"day": "Tuesday", "period": "6", "time": "01:30 - 02:20", "room": "IST602", "slot": "C"}, {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST626", "slot": "C"}]'::jsonb, '2024-08-05', '2024-12-20'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21LEH104T', 'German', 3, 36, 'Even Semester (2024-25)', '[{"day": "Thursday", "period": "6", "time": "01:30 - 02:20", "room": "IST502", "slot": "German"}, {"day": "Friday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST626", "slot": "German"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21GNH101J', 'Philosophy of Engineering', 2, 24, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST502", "slot": "E"}, {"day": "Wednesday", "period": "9", "time": "04:15 - 05:05", "room": "IST502", "slot": "E"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21MAB102T', 'Advanced Calculus and Complex Analysis', 4, 48, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "9", "time": "04:15 - 05:05", "room": "IST502", "slot": "A"}, {"day": "Tuesday", "period": "8", "time": "03:20 - 04:10", "room": "IST502", "slot": "A"}, {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST710", "slot": "A"}, {"day": "Thursday", "period": "2", "time": "09:55 - 10:45", "room": "IST510", "slot": "A"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21CYB101J', 'Chemistry', 5, 60, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "8", "time": "03:20 - 04:10", "room": "IST502", "slot": "B"}, {"day": "Tuesday", "period": "1, 2", "time": "09:00 - 10:45", "room": "Che lab", "slot": "Lab"}, {"day": "Tuesday", "period": "7", "time": "02:25 - 03:15", "room": "IST502", "slot": "B"}, {"day": "Wednesday", "period": "8", "time": "03:20 - 04:10", "room": "IST502", "slot": "B"}, {"day": "Thursday", "period": "9", "time": "04:15 - 05:05", "room": "IST502", "slot": "B"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21BTB102J', 'Electronic System and PCB Design', 2, 24, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "3, 4", "time": "10:50 - 12:35", "room": "IST 617", "slot": "PCB Lab"}, {"day": "Tuesday", "period": "6", "time": "01:30 - 02:20", "room": "IST502", "slot": "C"}, {"day": "Thursday", "period": "8", "time": "03:20 - 04:10", "room": "IST502", "slot": "C"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21CSS101J', 'Programming for Problem Solving', 4, 48, 'Even Semester (2024-25)', '[{"day": "Tuesday", "period": "9", "time": "04:15 - 05:05", "room": "IST502", "slot": "D"}, {"day": "Wednesday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST 617", "slot": "PPS lab"}, {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST710", "slot": "D"}, {"day": "Friday", "period": "3, 4", "time": "10:50 - 12:35", "room": "PPS LAB", "slot": "Lab"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21MES101L', 'Basic Civil and Mechanical Workshop', 2, 24, 'Even Semester (2024-25)', '[{"day": "Friday", "period": "6, 7, 8, 9", "time": "01:30 - 05:05", "room": "IST 20,21", "slot": "Workshop"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21PDM102L', 'General Aptitude', 0, 0, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "2", "time": "09:55 - 10:45", "room": "CDC", "slot": "CDC"}, {"day": "Wednesday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST510", "slot": "CDC"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21GNM102L', 'NSS', 0, 0, 'Even Semester (2024-25)', '[{"day": "Tuesday", "period": "3, 4", "time": "10:50 - 12:35", "room": "201", "slot": "NSS"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Electronics and Communication Engineering (Data Science)', '1', 'ECE-DS', '21BTB103T', 'Biology', 2, 24, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST710", "slot": "F"}, {"day": "Thursday", "period": "1", "time": "09:00 - 09:50", "room": "IST710", "slot": "F"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21LEH105T', 'Japanese', 3, 36, 'Even Semester (2024-25)', '[{"day": "Thursday", "period": "8, 9", "time": "03:20 - 05:05", "room": "IST702", "slot": "Japanese"}, {"day": "Friday", "period": "4", "time": "11:45 - 12:35", "room": "IST702", "slot": "Japanese"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21GNH101J', 'Philosophy of Engineering', 2, 24, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST702", "slot": "E"}, {"day": "Wednesday", "period": "8", "time": "03:20 - 04:10", "room": "IST702", "slot": "E"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21MAB102T', 'Advanced Calculus and Complex Analysis', 4, 48, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "8", "time": "03:20 - 04:10", "room": "IST702", "slot": "A"}, {"day": "Tuesday", "period": "8", "time": "03:20 - 04:10", "room": "IST702", "slot": "A"}, {"day": "Thursday", "period": "4", "time": "11:45 - 12:35", "room": "IST710", "slot": "A"}, {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST702", "slot": "A"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21CYB101J', 'Chemistry', 5, 60, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "9", "time": "04:15 - 05:05", "room": "IST702", "slot": "B"}, {"day": "Tuesday", "period": "7", "time": "02:25 - 03:15", "room": "IST702", "slot": "B"}, {"day": "Wednesday", "period": "7", "time": "02:25 - 03:15", "room": "IST702", "slot": "B"}, {"day": "Thursday", "period": "1, 2, 3", "time": "09:00 - 11:40", "room": "Che lab", "slot": "Lab"}, {"day": "Thursday", "period": "7", "time": "02:25 - 03:15", "room": "IST702", "slot": "B"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21CSS101J', 'Programming for Problem Solving', 4, 48, 'Even Semester (2024-25)', '[{"day": "Tuesday", "period": "9", "time": "04:15 - 05:05", "room": "IST702", "slot": "D"}, {"day": "Wednesday", "period": "6", "time": "01:30 - 02:20", "room": "IST702", "slot": "D"}, {"day": "Wednesday", "period": "9", "time": "04:15 - 05:05", "room": "IST702", "slot": "D"}, {"day": "Friday", "period": "8, 9", "time": "03:20 - 05:05", "room": "PPS LAB", "slot": "Lab"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21BTC105T', 'Cell biology (for Biotech)', 2, 24, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST520", "slot": "C"}, {"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST520", "slot": "C"}, {"day": "Thursday", "period": "6", "time": "01:30 - 02:20", "room": "IST510", "slot": "C"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21BTB104T', 'Biology: Human physiology and anatomy (only for Biomedical Engineering)', 2, 24, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "4", "time": "11:45 - 12:35", "room": "IST520", "slot": "G"}, {"day": "Thursday", "period": "6", "time": "01:30 - 02:20", "room": "IST520", "slot": "G"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21BTC101T', 'Biochemistry (for Biotech)', 3, 36, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "4", "time": "11:45 - 12:35", "room": "IST710", "slot": "F"}, {"day": "Tuesday", "period": "4", "time": "11:45 - 12:35", "room": "IST710", "slot": "F"}, {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST702", "slot": "F"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21MES101L', 'Basic Civil and Mechanical Workshop', 2, 24, 'Even Semester (2024-25)', '[{"day": "Wednesday", "period": "1, 2, 3, 4", "time": "09:00 - 12:35", "room": "IST 20,21", "slot": "Workshop"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21PDM102L', 'General Aptitude', 0, 0, 'Even Semester (2024-25)', '[{"day": "Tuesday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST710", "slot": "CDC"}, {"day": "Friday", "period": "2", "time": "09:55 - 10:45", "room": "IST702", "slot": "CDC"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biotechnology & Biomedical Engineering', '1', 'Biotech-B & Biomed. Engg.', '21GNM101L', 'Physical and Mental Health using Yoga', 0, 0, 'Even Semester (2024-25)', '[{"day": "Monday", "period": "2, 3", "time": "09:55 - 11:40", "room": "YOGA", "slot": "Yoga"}]'::jsonb, '2025-01-06', '2025-05-16'),
('Biomedical Engineering', '2', 'II-BME', '21MAB201T', 'Transforms and Boundary Value Problems', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 602", "slot": "A"}, {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 602", "slot": "A"}, {"day": "Thursday", "period": "1", "time": "09:00 - 09:50", "room": "IST 602", "slot": "A"}, {"day": "Friday", "period": "2", "time": "09:50 - 10:40", "room": "IST 602", "slot": "A"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Biomedical Engineering', '2', 'II-BME', '21BMC202T', 'Biomedical Signals and Systems', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 602", "slot": "B"}, {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 602", "slot": "B"}, {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST 602", "slot": "B"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Biomedical Engineering', '2', 'II-BME', '21BMC203J', 'Electric and Electronic Circuits', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "2", "time": "09:50 - 10:40", "room": "IST 602", "slot": "C"}, {"day": "Tuesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 602", "slot": "C"}, {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST 602", "slot": "C"}, {"day": "Monday", "period": "6, 7", "time": "01:20 - 03:00", "room": "EEC-107,309", "slot": "EEC Lab"}, {"day": "Thursday", "period": "8, 9", "time": "03:10 - 04:50", "room": "EEC-107,309", "slot": "EEC Lab"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Biomedical Engineering', '2', 'II-BME', '21BMC204J', 'Digital Logic for Medical Systems', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 602", "slot": "D"}, {"day": "Thursday", "period": "4", "time": "11:40 - 12:30", "room": "IST 602", "slot": "D"}, {"day": "Friday", "period": "4", "time": "11:40 - 12:30", "room": "IST 602", "slot": "D"}, {"day": "Monday", "period": "6, 7", "time": "01:20 - 03:00", "room": "DLMS-107,309", "slot": "DLMS Lab"}, {"day": "Thursday", "period": "8, 9", "time": "03:10 - 04:50", "room": "DLMS-107,309", "slot": "DLMS Lab"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Biomedical Engineering', '2', 'II-BME', '21PYS202T', 'Medical Physics', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST 602", "slot": "E"}, {"day": "Tuesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 602", "slot": "E"}, {"day": "Thursday", "period": "2", "time": "09:50 - 10:40", "room": "IST 602", "slot": "E"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Biomedical Engineering', '2', 'II-BME', '21LEM201T', 'Professional Ethics', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST 602", "slot": "F"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Biomedical Engineering', '2', 'II-BME', '21LEM202T', 'Universal Human Values-II', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "7", "time": "02:10 - 03:00", "room": "G-602", "slot": "G"}, {"day": "Friday", "period": "8", "time": "03:10 - 04:00", "room": "G-602", "slot": "G"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Biomedical Engineering', '2', 'II-BME', '21PDM201L', 'Verbal Reasoning', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "6, 7", "time": "01:20 - 03:00", "room": "H-TB-106", "slot": "H"}, {"day": "Wednesday", "period": "6", "time": "01:20 - 02:10", "room": "H-TB-106", "slot": "H"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Biomedical Engineering', '2', 'II-BME', '21PDH201T', 'Social Engineering', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "3, 4", "time": "10:50 - 12:30", "room": "IST 602", "slot": "I"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21MAB201T', 'Transforms and Boundary Value Problems', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "2", "time": "09:50 - 10:40", "room": "IST 416", "slot": "A"}, {"day": "Tuesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 416", "slot": "A"}, {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 416", "slot": "A"}, {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST 416", "slot": "A"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21ECC201T', 'Solid State Devices', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 416", "slot": "B"}, {"day": "Thursday", "period": "1", "time": "09:00 - 09:50", "room": "IST 416", "slot": "B"}, {"day": "Friday", "period": "2", "time": "09:50 - 10:40", "room": "IST 416", "slot": "B"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21CSS201T', 'Computer Organization and Architecture', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 416", "slot": "C"}, {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 416", "slot": "C"}, {"day": "Thursday", "period": "2", "time": "09:50 - 10:40", "room": "IST 416", "slot": "C"}, {"day": "Friday", "period": "4", "time": "11:40 - 12:30", "room": "IST 416", "slot": "C"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21ECC203T', 'Digital Logic Design', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 416", "slot": "D"}, {"day": "Wednesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 416", "slot": "D"}, {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST 416", "slot": "D"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21ECC205T', 'Electromagnetic Theory and Interference', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST 416", "slot": "E"}, {"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 416", "slot": "E"}, {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST 416", "slot": "E"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21LEM201T', 'Professional Ethics', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Thursday", "period": "4", "time": "11:40 - 12:30", "room": "IST 416", "slot": "F"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21LEM202T', 'Universal Human Values-II', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "6, 7", "time": "01:20 - 03:00", "room": "G-602", "slot": "G"}, {"day": "Tuesday", "period": "6, 7", "time": "01:20 - 03:00", "room": "G-602", "slot": "G"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21PDM201L', 'Verbal Reasoning', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "8, 9", "time": "03:10 - 04:50", "room": "H-TB -106", "slot": "H"}, {"day": "Wednesday", "period": "6, 7", "time": "01:20 - 03:00", "room": "H-TB - 106", "slot": "H"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21PDH209T', 'Social Engineering', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "3, 4", "time": "10:50 - 12:30", "room": "IST 416", "slot": "I"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS A', '21ECC211L', 'Devices and Digital IC Laboratory', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "8, 9", "time": "03:10 - 04:50", "room": "LAB -309/107", "slot": "LAB"}, {"day": "Thursday", "period": "6, 7", "time": "01:20 - 03:00", "room": "LAB -309/107", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21MAB201T', 'Transforms and Boundary Value Problems', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "9", "time": "04:00 - 04:50", "room": "IST 411", "slot": "A"}, {"day": "Wednesday", "period": "8", "time": "03:10 - 04:00", "room": "IST 411", "slot": "A"}, {"day": "Thursday", "period": "6", "time": "01:20 - 02:10", "room": "IST 411", "slot": "A"}, {"day": "Friday", "period": "7", "time": "02:10 - 03:00", "room": "IST 411", "slot": "A"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21ECC201T', 'Solid State Devices', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "7", "time": "02:10 - 03:00", "room": "IST 411", "slot": "B"}, {"day": "Thursday", "period": "8", "time": "03:10 - 04:00", "room": "IST 411", "slot": "B"}, {"day": "Friday", "period": "8", "time": "03:10 - 04:00", "room": "IST 411", "slot": "B"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21CSS201T', 'Computer Organization and Architecture', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "8", "time": "03:10 - 04:00", "room": "IST 411", "slot": "C"}, {"day": "Tuesday", "period": "6", "time": "01:20 - 02:10", "room": "IST 411", "slot": "C"}, {"day": "Thursday", "period": "7", "time": "02:10 - 03:00", "room": "IST 411", "slot": "C"}, {"day": "Friday", "period": "9", "time": "04:00 - 04:50", "room": "IST 411", "slot": "C"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21ECC203T', 'Digital Logic Design', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "6", "time": "01:20 - 02:10", "room": "IST 411", "slot": "D"}, {"day": "Tuesday", "period": "7", "time": "02:10 - 03:00", "room": "IST 411", "slot": "D"}, {"day": "Wednesday", "period": "9", "time": "04:00 - 04:50", "room": "IST 411", "slot": "D"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21ECC205T', 'Electromagnetic Theory and Interference', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "8", "time": "03:10 - 04:00", "room": "IST 411", "slot": "E"}, {"day": "Wednesday", "period": "7", "time": "02:10 - 03:00", "room": "IST 411", "slot": "E"}, {"day": "Thursday", "period": "9", "time": "04:00 - 04:50", "room": "IST 411", "slot": "E"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21LEM201T', 'Professional Ethics', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Friday", "period": "6", "time": "01:20 - 02:10", "room": "IST 411", "slot": "F"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21LEM202T', 'Universal Human Values-II', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "1, 2", "time": "09:00 - 10:40", "room": "G - 401", "slot": "G"}, {"day": "Thursday", "period": "1, 2", "time": "09:00 - 10:40", "room": "G-401", "slot": "G"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21PDM201L', 'Verbal Reasoning', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Thursday", "period": "3, 4", "time": "10:50 - 12:30", "room": "H-TB-106", "slot": "H"}, {"day": "Friday", "period": "1, 2", "time": "09:00 - 10:40", "room": "H - TB- 106", "slot": "H"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21PDH209T', 'Social Engineering', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "9", "time": "04:00 - 04:50", "room": "IST 411", "slot": "I"}, {"day": "Wednesday", "period": "6", "time": "01:20 - 02:10", "room": "IST 411", "slot": "I"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '2', 'II-ECE-DS B', '21ECC211L', 'Devices and Digital IC Laboratory', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "3, 4", "time": "10:50 - 12:30", "room": "LAB -309/107", "slot": "LAB"}, {"day": "Tuesday", "period": "1, 2", "time": "09:00 - 10:40", "room": "LAB -309/107", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21MAB302T', 'Discrete Mathematics', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "4", "time": "11:40 - 12:30", "room": "IST 518", "slot": "A"}, {"day": "Wednesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 518", "slot": "A"}, {"day": "Thursday", "period": "1", "time": "09:00 - 09:50", "room": "IST 518", "slot": "A"}, {"day": "Friday", "period": "2", "time": "09:50 - 10:40", "room": "IST 518", "slot": "A"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21ECC301P', 'Microprocessor, Microcontroller, and Interfacing Techniques', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "2", "time": "09:50 - 10:40", "room": "IST 518", "slot": "B"}, {"day": "Monday", "period": "3", "time": "10:50 - 11:40", "room": "IST 518", "slot": "B"}, {"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 518", "slot": "B"}, {"day": "Tuesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 518", "slot": "B-Proj"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21ECC303T', 'VLSI Design and Technology', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 518", "slot": "C"}, {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST 518", "slot": "C"}, {"day": "Friday", "period": "4", "time": "11:40 - 12:30", "room": "IST 518", "slot": "C"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21ECE468T', 'System and Network on Chip', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 518", "slot": "D"}, {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 518", "slot": "D"}, {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST 518", "slot": "D"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21CSO355T', 'Machine learning for all', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST 518", "slot": "E"}, {"day": "Thursday", "period": "2", "time": "09:50 - 10:40", "room": "IST 518", "slot": "E"}, {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST 518", "slot": "E"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21GNP301L', 'Community connect', 1, 12, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 518", "slot": "F"}, {"day": "Thursday", "period": "4", "time": "11:40 - 12:30", "room": "IST 518", "slot": "F"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21PDM301L', 'Analytical and logical thinking skills', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "6, 7", "time": "01:20 - 03:00", "room": "625", "slot": "G"}, {"day": "Tuesday", "period": "7", "time": "02:10 - 03:00", "room": "625", "slot": "G"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21LEM301T', 'Indian Art Form', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 518", "slot": "H"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-A', '21ECC311L', 'VLSI Design/ Microprocessor Laboratory', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "8, 9", "time": "03:10 - 04:50", "room": "LAB-108/309", "slot": "LAB"}, {"day": "Friday", "period": "6, 7", "time": "01:20 - 03:00", "room": "LAB-108/309", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21MAB302T', 'Discrete Mathematics', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "8", "time": "03:10 - 04:00", "room": "IST 518", "slot": "A"}, {"day": "Wednesday", "period": "8", "time": "03:10 - 04:00", "room": "IST 518", "slot": "A"}, {"day": "Thursday", "period": "6", "time": "01:20 - 02:10", "room": "IST 518", "slot": "A"}, {"day": "Friday", "period": "7", "time": "02:10 - 03:00", "room": "IST 518", "slot": "A"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21ECC301P', 'Microprocessor, Microcontroller, and Interfacing Techniques', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "7", "time": "02:10 - 03:00", "room": "IST 518", "slot": "B"}, {"day": "Tuesday", "period": "7", "time": "02:10 - 03:00", "room": "IST 518", "slot": "B"}, {"day": "Wednesday", "period": "6", "time": "01:20 - 02:10", "room": "IST 518", "slot": "B-Proj"}, {"day": "Wednesday", "period": "7", "time": "02:10 - 03:00", "room": "IST 518", "slot": "B"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21ECC303T', 'VLSI Design and Technology', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "9", "time": "04:00 - 04:50", "room": "IST 518", "slot": "C"}, {"day": "Thursday", "period": "7", "time": "02:10 - 03:00", "room": "IST 518", "slot": "C"}, {"day": "Friday", "period": "6", "time": "01:20 - 02:10", "room": "IST 518", "slot": "C"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21ECE468T', 'System and Network on Chip', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "9", "time": "04:00 - 04:50", "room": "IST 518", "slot": "D"}, {"day": "Tuesday", "period": "8", "time": "03:10 - 04:00", "room": "IST 518", "slot": "D"}, {"day": "Friday", "period": "9", "time": "04:00 - 04:50", "room": "IST 518", "slot": "D"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21CSO355T', 'Machine learning for all', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "6", "time": "01:20 - 02:10", "room": "IST 518", "slot": "E"}, {"day": "Thursday", "period": "8", "time": "03:10 - 04:00", "room": "IST 518", "slot": "E"}, {"day": "Friday", "period": "8", "time": "03:10 - 04:00", "room": "IST 518", "slot": "E"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21GNP301L', 'Community connect', 1, 12, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "6", "time": "01:20 - 02:10", "room": "IST 518", "slot": "F"}, {"day": "Thursday", "period": "9", "time": "04:00 - 04:50", "room": "IST 518", "slot": "F"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21PDM301L', 'Analytical and logical thinking skills', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "1, 2", "time": "09:00 - 10:40", "room": "625", "slot": "G"}, {"day": "Wednesday", "period": "1, 2", "time": "09:00 - 10:40", "room": "625", "slot": "G"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21LEM301T', 'Indian Art Form', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "9", "time": "04:00 - 04:50", "room": "IST 518", "slot": "H"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '3', 'III-ECE-B', '21ECC311L', 'VLSI Design/ Microprocessor Laboratory', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "1, 2", "time": "09:00 - 10:40", "room": "LAB-108/309", "slot": "LAB"}, {"day": "Thursday", "period": "1, 2", "time": "09:00 - 10:40", "room": "LAB-108/309", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21MAB302T', 'Discrete Mathematics', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "4", "time": "11:40 - 12:30", "room": "IST 519", "slot": "A"}, {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 519", "slot": "A"}, {"day": "Thursday", "period": "1", "time": "09:00 - 09:50", "room": "IST 519", "slot": "A"}, {"day": "Friday", "period": "2", "time": "09:50 - 10:40", "room": "IST 519", "slot": "A"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21ECC301P', 'Microprocessor, Microcontroller, and Interfacing Techniques', 4, 48, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "2", "time": "09:50 - 10:40", "room": "IST 519", "slot": "B"}, {"day": "Tuesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 519", "slot": "B"}, {"day": "Wednesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 519", "slot": "B"}, {"day": "Friday", "period": "4", "time": "11:40 - 12:30", "room": "IST 519", "slot": "B-Proj"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21ECC303T', 'VLSI Design and Technology', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "3", "time": "10:50 - 11:40", "room": "IST 519", "slot": "C"}, {"day": "Tuesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 519", "slot": "C"}, {"day": "Wednesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 519", "slot": "C"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21CSO355T', 'Machine learning for all', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 519", "slot": "D"}, {"day": "Thursday", "period": "2", "time": "09:50 - 10:40", "room": "IST 519", "slot": "D"}, {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST 519", "slot": "D"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21ECE371T', 'Database Design and Management', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST 519", "slot": "E"}, {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST 519", "slot": "E"}, {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST 519", "slot": "E"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21GNP301L', 'Community connect', 1, 12, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 519", "slot": "F"}, {"day": "Thursday", "period": "4", "time": "11:40 - 12:30", "room": "IST 519", "slot": "F"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21PDM301L', 'Analytical and logical thinking skills', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "8, 9", "time": "03:10 - 04:50", "room": "625", "slot": "G"}, {"day": "Friday", "period": "6, 7", "time": "01:20 - 03:00", "room": "625", "slot": "G"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21LEM301T', 'Indian Art Form', 0, 0, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 519", "slot": "H"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21ECC311L', 'VLSI Design/ Microprocessor Laboratory', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "6, 7", "time": "01:20 - 03:00", "room": "LAB-108/107", "slot": "LAB"}, {"day": "Friday", "period": "8, 9", "time": "03:10 - 04:50", "room": "LAB-108/107", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-A', '21GNH401T', 'Behavioural Psychology', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "3", "time": "10:50 - 11:40", "room": "IST 225", "slot": "A"}, {"day": "Thursday", "period": "2", "time": "09:50 - 10:40", "room": "IST 225", "slot": "A"}, {"day": "Friday", "period": "2", "time": "09:50 - 10:40", "room": "IST 225", "slot": "A"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-A', '21ECC401T', 'Wireless Communication and Antenna Systems', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 225", "slot": "B"}, {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 225", "slot": "B"}, {"day": "Thursday", "period": "4", "time": "11:40 - 12:30", "room": "IST 225", "slot": "B"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-A', '21ECC402P', 'Computer Communication and Network Security', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST 225", "slot": "C"}, {"day": "Tuesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 225", "slot": "C"}, {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST 225", "slot": "C"}, {"day": "Wednesday", "period": "2", "time": "09:50 - 10:40", "room": "LAB - IST 108", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-A', '21ECE461T', 'Semiconductor Memory Design', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "4", "time": "11:40 - 12:30", "room": "IST 225", "slot": "D"}, {"day": "Tuesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 225", "slot": "D"}, {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST 225", "slot": "D"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-A', '21ECE463T', 'Scripting Language for Electronic Design Automation', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 225", "slot": "E"}, {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST 225", "slot": "E"}, {"day": "Friday", "period": "4", "time": "11:40 - 12:30", "room": "IST 225", "slot": "E"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-A', '21CSO355T', 'Machine learning for all', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 225", "slot": "F"}, {"day": "Wednesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 225", "slot": "F"}, {"day": "Thursday", "period": "1", "time": "09:00 - 09:50", "room": "IST 225", "slot": "F"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-A', '21ECC402P-LAB', 'Computer Communication and Network Security Laboratory', 1, 12, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "2", "time": "09:50 - 10:40", "room": "LAB - IST 108", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-B', '21GNH401T', 'Behavioural Psychology', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "2", "time": "09:50 - 10:40", "room": "IST 227", "slot": "A"}, {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 227", "slot": "A"}, {"day": "Thursday", "period": "4", "time": "11:40 - 12:30", "room": "IST 227", "slot": "A"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-B', '21ECC401T', 'Wireless Communication and Antenna Systems', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 227", "slot": "B"}, {"day": "Wednesday", "period": "4", "time": "11:40 - 12:30", "room": "IST 227", "slot": "B"}, {"day": "Thursday", "period": "2", "time": "09:50 - 10:40", "room": "IST 227", "slot": "B"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-B', '21ECC402P', 'Computer Communication and Network Security', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST 227", "slot": "C"}, {"day": "Tuesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 227", "slot": "C"}, {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST 227", "slot": "C"}, {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "LAB - IST 108", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-B', '21ECE461T', 'Semiconductor Memory Design', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Wednesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 227", "slot": "D"}, {"day": "Thursday", "period": "1", "time": "09:00 - 09:50", "room": "IST 227", "slot": "D"}, {"day": "Friday", "period": "2", "time": "09:50 - 10:40", "room": "IST 227", "slot": "D"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-B', '21ECE463T', 'Scripting Language for Electronic Design Automation', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "3", "time": "10:50 - 11:40", "room": "IST 227", "slot": "E"}, {"day": "Tuesday", "period": "2", "time": "09:50 - 10:40", "room": "IST 227", "slot": "E"}, {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST 227", "slot": "E"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-B', '21CSO355T', 'Machine learning for all', 3, 36, 'Odd Semester (2026-2027)', '[{"day": "Monday", "period": "4", "time": "11:40 - 12:30", "room": "IST 227", "slot": "F"}, {"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST 227", "slot": "F"}, {"day": "Friday", "period": "4", "time": "11:40 - 12:30", "room": "IST 227", "slot": "F"}]'::jsonb, '2026-07-06', '2026-11-27'),
('Electronics and Communication Engineering', '4', 'IV-ECE-B', '21ECC402P-LAB', 'Computer Communication and Network Security Laboratory', 1, 12, 'Odd Semester (2026-2027)', '[{"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "LAB - IST 108", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27');

-- ==============================================================================
-- 6. Helper View: Unnest timetable slots into individual schedule rows
-- ==============================================================================
CREATE OR REPLACE VIEW public.view_timetable_schedule AS
SELECT 
    tr.id AS record_id,
    tr.department,
    tr.year,
    tr.section,
    tr.semester,
    tr.course_code,
    tr.course_name,
    tr.credits,
    tr.total_no_of_hours,
    tr.semester_start_date,
    tr.semester_end_date,
    slot_item->>'day' AS day_of_week,
    slot_item->>'period' AS periods,
    slot_item->>'time' AS time_interval,
    slot_item->>'room' AS room_number,
    slot_item->>'slot' AS slot_code
FROM 
    public.timetable_records tr,
    jsonb_array_elements(tr.timetable) AS slot_item;
