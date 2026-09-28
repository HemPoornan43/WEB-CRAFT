-- ==============================================================================
-- SUPABASE 3RD YEAR TIMETABLE SCRIPT (V SEMESTER)
-- Institution: SRM Institute of Science and Technology, Tiruchirappalli Campus
-- Faculty of Engineering and Technology
-- ==============================================================================

-- 1. Create timetable_records table matching exact requested fields
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
('Electronics and Communication Engineering (Data Science)', '3', 'III-ECE-DS', '21ECC311L', 'VLSI Design/ Microprocessor Laboratory', 2, 24, 'Odd Semester (2026-2027)', '[{"day": "Tuesday", "period": "6, 7", "time": "01:20 - 03:00", "room": "LAB-108/107", "slot": "LAB"}, {"day": "Friday", "period": "8, 9", "time": "03:10 - 04:50", "room": "LAB-108/107", "slot": "LAB"}]'::jsonb, '2026-07-06', '2026-11-27');

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
