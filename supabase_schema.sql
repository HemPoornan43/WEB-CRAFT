-- ================================================
-- Supabase SQL Schema for Attendance Predictor
-- Run this in your Supabase SQL Editor
-- ================================================

-- 1. STUDENTS table: stores login credentials + section info
CREATE TABLE IF NOT EXISTS public.students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  register_no   TEXT NOT NULL UNIQUE,   -- e.g. "21BCE0123" (used as username)
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,          -- bcrypt hash (Supabase auth handles this)
  section_id    TEXT NOT NULL,          -- maps to CLASS_SECTIONS[].id e.g. "I-ECE-A"
  department    TEXT,
  year          TEXT,
  email         TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ATTENDANCE table: stores per-subject attendance for each student
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

-- 3. Enable Row Level Security
ALTER TABLE public.students   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 4. Policies: students can only read their own data
CREATE POLICY "Students can view own profile"
  ON public.students FOR SELECT
  USING (register_no = current_setting('app.current_user', true));

CREATE POLICY "Students can view own attendance"
  ON public.attendance FOR SELECT
  USING (register_no = current_setting('app.current_user', true));

-- 5. Allow anonymous reads via service role (for our custom auth)
CREATE POLICY "Allow service role full access on students"
  ON public.students FOR ALL
  USING (true);

CREATE POLICY "Allow service role full access on attendance"
  ON public.attendance FOR ALL
  USING (true);

-- ================================================
-- Sample student data (for testing)
-- Password for all test students: "password123"
-- (stored as plain text here; hash in production)
-- ================================================

INSERT INTO public.students (register_no, name, section_id, department, year, email, password_hash)
VALUES
  ('21BCE0001', 'Aarav Sharma', 'I-ECE-A', 'Electronics & Communication Engineering', '1st Year', 'aarav@test.com', 'password123'),
  ('21BCE0002', 'Priya Nair', 'I-ECE-A', 'Electronics & Communication Engineering', '1st Year', 'priya@test.com', 'password123'),
  ('21BCE0003', 'Rahul Verma', 'I-ECE-B', 'Electronics & Communication Engineering', '1st Year', 'rahul@test.com', 'password123'),
  ('21BCE0004', 'Sneha Patel', 'I-CSE-A', 'Computer Science Engineering', '1st Year', 'sneha@test.com', 'password123')
ON CONFLICT (register_no) DO NOTHING;

-- Sample attendance data for 21BCE0001
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
WHERE s.register_no = '21BCE0001'
ON CONFLICT (register_no, subject_code) DO NOTHING;
