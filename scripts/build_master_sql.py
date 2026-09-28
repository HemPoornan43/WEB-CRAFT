with open('database/supabase_schema_and_data.sql', 'r', encoding='utf-8') as f:
    tt_sql = f.read()

master_header = """-- ==============================================================================
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
"""

full_master = master_header + "\n" + tt_sql

with open('database/supabase_master_setup.sql', 'w', encoding='utf-8') as f:
    f.write(full_master)

print('Generated database/supabase_master_setup.sql successfully!')
