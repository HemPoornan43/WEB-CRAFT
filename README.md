# Timetable Dataset for Supabase

This directory contains the converted timetable dataset extracted from the SRM IST (Faculty of Engineering and Technology) 2024-25 timetable documents.

## Exact Fields Extracted
1. **Department**: Academic Department (ECE, EEE, Biotech, Biomed)
2. **Year**: Academic Year (1st Year)
3. **Section**: Section name (`ECE-A`, `ECE-B & EEE`, `ECE-DS`, `Biotech-B & Biomed. Engg.`)
4. **Course code**: Official course code (e.g. `21MAB102T`, `21CSS101J`, `21CYB101J`)
5. **Course name**: Subject name (e.g. `Advanced Calculus and Complex Analysis`)
6. **Credits**: Course credits (e.g. `4`, `5`, `2`)
7. **Semester**: Semester name (`Odd Semester (2024-25)` / `Even Semester (2024-25)`)
8. **Timetable**: Scheduled weekly days, time ranges, periods, and lecture/lab rooms
9. **Semester start date**: Standard semester commencement date (`2024-08-05` / `2025-01-06`)
10. **Semester end date**: Standard semester completion date (`2024-12-20` / `2025-05-16`)

---

## Files Provided
- [`supabase_schema_and_data.sql`](./supabase_schema_and_data.sql): Complete SQL script with `CREATE TABLE`, indexes, RLS policies, views, and `INSERT INTO` statements.
- [`supabase_timetable_data.csv`](./supabase_timetable_data.csv): Ready for direct import via Supabase Studio ("Import data from CSV").
- [`supabase_timetable_data.json`](./supabase_timetable_data.json): JSON array of 42 course timetable records.
- [`supabase_section_timetables.json`](./supabase_section_timetables.json): Full 5-day period-by-period weekly grids for each section.
- [`generate_supabase_export.py`](./generate_supabase_export.py): Python generator script.

---

## How to Import into Supabase

### Option 1: Direct SQL Execution (Recommended)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and navigate to the **SQL Editor** on the left menu.
3. Open [`supabase_schema_and_data.sql`](./supabase_schema_and_data.sql), copy all content, paste it into the SQL Editor, and click **RUN**.
4. Both `timetable_records` and `section_timetables` will be created and populated.

### Option 2: CSV Import
1. In your Supabase Dashboard, create a new table named `timetable_records`.
2. Add the columns matching the CSV headers:
   - `department` (text)
   - `year` (text)
   - `section` (text)
   - `course_code` (text)
   - `course_name` (text)
   - `credits` (int4)
   - `semester` (text)
   - `timetable` (jsonb)
   - `semester_start_date` (date)
   - `semester_end_date` (date)
3. Click **Insert** -> **Import data from CSV** and upload [`supabase_timetable_data.csv`](./supabase_timetable_data.csv).