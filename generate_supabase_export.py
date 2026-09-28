import json
import csv
import os

# Define the period timings for SRM IST FET
PERIOD_TIMES = {
    "Period 1": "09:00 - 09:50",
    "Period 2": "09:55 - 10:45",
    "Period 3": "10:50 - 11:40",
    "Period 4": "11:45 - 12:35",
    "Period 5": "12:35 - 01:30", # Lunch / Break
    "Period 6": "01:30 - 02:20",
    "Period 7": "02:25 - 03:15",
    "Period 8": "03:20 - 04:10",
    "Period 9": "04:15 - 05:05"
}

# The dataset extracted from the 4 timetable sheets:
# Section 1: Page 1 - I ECE-A (Odd Semester 2024-25)
# Section 2: Page 2 - I ECE-B & EEE (Odd Semester 2024-25)
# Section 3: Page 3 - I ECE-DS (Even Semester 2024-25)
# Section 4: Page 4 - I Biotech-B & Biomed. Engg. (Even Semester 2024-25)

course_records = [
    # -------------------------------------------------------------
    # PAGE 1: I ECE-A (Department: Electronics and Communication Engineering)
    # -------------------------------------------------------------
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21LEH104T",
        "course_name": "German",
        "credits": 3,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Thursday", "period": "1, 2, 3", "time": "09:00 - 11:40", "room": "IST602", "type": "Theory/Tutorial"},
            {"day": "Friday", "period": "7, 8", "time": "02:25 - 04:10", "room": "IST626", "type": "Theory/Tutorial"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21GNH101J",
        "course_name": "Philosophy of Engineering",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST602", "slot": "E"},
            {"day": "Wednesday", "period": "2", "time": "09:55 - 10:45", "room": "IST602", "slot": "E"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21MAB102T",
        "course_name": "Advanced Calculus and Complex Analysis",
        "credits": 4,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "4", "time": "11:45 - 12:35", "room": "IST602", "slot": "A"},
            {"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST602", "slot": "A"},
            {"day": "Thursday", "period": "4", "time": "11:45 - 12:35", "room": "IST602", "slot": "A"},
            {"day": "Friday", "period": "2", "time": "09:55 - 10:45", "room": "IST602", "slot": "A"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21CYB101J",
        "course_name": "Chemistry",
        "credits": 5,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "3", "time": "10:50 - 11:40", "room": "IST602", "slot": "B"},
            {"day": "Monday", "period": "6, 7", "time": "01:30 - 03:15", "room": "Che lab", "slot": "Lab"},
            {"day": "Tuesday", "period": "2", "time": "09:55 - 10:45", "room": "IST602", "slot": "B"},
            {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST602", "slot": "B"},
            {"day": "Friday", "period": "4", "time": "11:45 - 12:35", "room": "IST602", "slot": "B"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21BTB102J",
        "course_name": "Electronic System and PCB Design",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Tuesday", "period": "1", "time": "09:00 - 09:50", "room": "IST602", "slot": "C"},
            {"day": "Wednesday", "period": "8, 9", "time": "03:20 - 05:05", "room": "IST 108", "slot": "PCB Lab"},
            {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST602", "slot": "C"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21CSS101J",
        "course_name": "Programming for Problem Solving",
        "credits": 4,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Tuesday", "period": "4", "time": "11:45 - 12:35", "room": "IST602", "slot": "D"},
            {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST602", "slot": "D"},
            {"day": "Wednesday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST 618", "slot": "PPS LAB"},
            {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST602", "slot": "D"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21MES101L",
        "course_name": "Basic Civil and Mechanical Workshop",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Tuesday", "period": "6, 7, 8", "time": "01:30 - 04:10", "room": "IST 20,21", "slot": "Workshop"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21PDM102L",
        "course_name": "General Aptitude",
        "credits": 0,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "9", "time": "04:15 - 05:05", "room": "IST710", "slot": "CDC"},
            {"day": "Thursday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST510", "slot": "CDC"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21GNM102L",
        "course_name": "NSS",
        "credits": 0,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Thursday", "period": "8, 9", "time": "03:20 - 05:05", "room": "IST201", "slot": "NSS"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "course_code": "21BTB103T",
        "course_name": "Biology",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "8", "time": "03:20 - 04:10", "room": "IST710", "slot": "F"},
            {"day": "Friday", "period": "6", "time": "01:30 - 02:20", "room": "IST602", "slot": "F"}
        ]
    },

    # -------------------------------------------------------------
    # PAGE 2: I ECE-B & EEE (Department: ECE & EEE)
    # -------------------------------------------------------------
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21LEH104T",
        "course_name": "German",
        "credits": 3,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Thursday", "period": "7, 8", "time": "02:25 - 04:10", "room": "IST602", "slot": "German"},
            {"day": "Friday", "period": "6", "time": "01:30 - 02:20", "room": "IST626", "slot": "German"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21GNH101J",
        "course_name": "Philosophy of Engineering",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST602", "slot": "E"},
            {"day": "Wednesday", "period": "8", "time": "03:20 - 04:10", "room": "IST602", "slot": "E"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21MAB102T",
        "course_name": "Advanced Calculus and Complex Analysis",
        "credits": 4,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "9", "time": "04:15 - 05:05", "room": "IST602", "slot": "A"},
            {"day": "Tuesday", "period": "8", "time": "03:20 - 04:10", "room": "IST602", "slot": "A"},
            {"day": "Thursday", "period": "4", "time": "11:45 - 12:35", "room": "IST710", "slot": "A"},
            {"day": "Friday", "period": "9", "time": "04:15 - 05:05", "room": "IST602", "slot": "A"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21CYB101J",
        "course_name": "Chemistry",
        "credits": 5,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "3, 4", "time": "10:50 - 12:35", "room": "Che lab", "slot": "Lab"},
            {"day": "Monday", "period": "8", "time": "03:20 - 04:10", "room": "IST602", "slot": "B"},
            {"day": "Tuesday", "period": "7", "time": "02:25 - 03:15", "room": "IST602", "slot": "B"},
            {"day": "Wednesday", "period": "7", "time": "02:25 - 03:15", "room": "IST602", "slot": "B"},
            {"day": "Friday", "period": "8", "time": "03:20 - 04:10", "room": "IST602", "slot": "B"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21BTB102J",
        "course_name": "Electronic System and PCB Design (for ECE)",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "2", "time": "09:55 - 10:45", "room": "IST710", "slot": "F"},
            {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST710", "slot": "F"},
            {"day": "Friday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST 617", "slot": "PCB Lab"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21EEC101J",
        "course_name": "Electrical Circuits (for EEE)",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "2", "time": "09:55 - 10:45", "room": "IST520", "slot": "G"},
            {"day": "Wednesday", "period": "1", "time": "09:00 - 09:50", "room": "IST520", "slot": "G"},
            {"day": "Friday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST 617", "slot": "EC Lab"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21CSS101J",
        "course_name": "Programming for Problem Solving",
        "credits": 4,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Tuesday", "period": "9", "time": "04:15 - 05:05", "room": "IST602", "slot": "D"},
            {"day": "Wednesday", "period": "2", "time": "09:55 - 10:45", "room": "IST 617", "slot": "PPS Lab"},
            {"day": "Wednesday", "period": "6", "time": "01:30 - 02:20", "room": "IST618", "slot": "PPS LAB"},
            {"day": "Wednesday", "period": "9", "time": "04:15 - 05:05", "room": "IST602", "slot": "D"},
            {"day": "Thursday", "period": "6", "time": "01:30 - 02:20", "room": "IST602", "slot": "D"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21MES101L",
        "course_name": "Basic Civil and Mechanical Workshop",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Tuesday", "period": "1, 2, 3, 4", "time": "09:00 - 12:35", "room": "IST 20,21", "slot": "Workshop"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21PDM102L",
        "course_name": "General Aptitude",
        "credits": 0,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST609", "slot": "CDC"},
            {"day": "Wednesday", "period": "3, 4", "time": "10:50 - 12:35", "room": "IST510", "slot": "CDC"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21GNM102L",
        "course_name": "NSS",
        "credits": 0,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Thursday", "period": "1, 2", "time": "09:00 - 10:45", "room": "201", "slot": "NSS"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "course_code": "21BTB103T",
        "course_name": "Biology",
        "credits": 2,
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "timetable": [
            {"day": "Tuesday", "period": "6", "time": "01:30 - 02:20", "room": "IST602", "slot": "C"},
            {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST626", "slot": "C"}
        ]
    },

    # -------------------------------------------------------------
    # PAGE 3: I ECE-DS (Department: ECE - Data Science)
    # -------------------------------------------------------------
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21LEH104T",
        "course_name": "German",
        "credits": 3,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Thursday", "period": "6", "time": "01:30 - 02:20", "room": "IST502", "slot": "German"},
            {"day": "Friday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST626", "slot": "German"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21GNH101J",
        "course_name": "Philosophy of Engineering",
        "credits": 2,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST502", "slot": "E"},
            {"day": "Wednesday", "period": "9", "time": "04:15 - 05:05", "room": "IST502", "slot": "E"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21MAB102T",
        "course_name": "Advanced Calculus and Complex Analysis",
        "credits": 4,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "9", "time": "04:15 - 05:05", "room": "IST502", "slot": "A"},
            {"day": "Tuesday", "period": "8", "time": "03:20 - 04:10", "room": "IST502", "slot": "A"},
            {"day": "Wednesday", "period": "3", "time": "10:50 - 11:40", "room": "IST710", "slot": "A"},
            {"day": "Thursday", "period": "2", "time": "09:55 - 10:45", "room": "IST510", "slot": "A"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21CYB101J",
        "course_name": "Chemistry",
        "credits": 5,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "8", "time": "03:20 - 04:10", "room": "IST502", "slot": "B"},
            {"day": "Tuesday", "period": "1, 2", "time": "09:00 - 10:45", "room": "Che lab", "slot": "Lab"},
            {"day": "Tuesday", "period": "7", "time": "02:25 - 03:15", "room": "IST502", "slot": "B"},
            {"day": "Wednesday", "period": "8", "time": "03:20 - 04:10", "room": "IST502", "slot": "B"},
            {"day": "Thursday", "period": "9", "time": "04:15 - 05:05", "room": "IST502", "slot": "B"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21BTB102J",
        "course_name": "Electronic System and PCB Design",
        "credits": 2,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "3, 4", "time": "10:50 - 12:35", "room": "IST 617", "slot": "PCB Lab"},
            {"day": "Tuesday", "period": "6", "time": "01:30 - 02:20", "room": "IST502", "slot": "C"},
            {"day": "Thursday", "period": "8", "time": "03:20 - 04:10", "room": "IST502", "slot": "C"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21CSS101J",
        "course_name": "Programming for Problem Solving",
        "credits": 4,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Tuesday", "period": "9", "time": "04:15 - 05:05", "room": "IST502", "slot": "D"},
            {"day": "Wednesday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST 617", "slot": "PPS lab"},
            {"day": "Thursday", "period": "3", "time": "10:50 - 11:40", "room": "IST710", "slot": "D"},
            {"day": "Friday", "period": "3, 4", "time": "10:50 - 12:35", "room": "PPS LAB", "slot": "Lab"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21MES101L",
        "course_name": "Basic Civil and Mechanical Workshop",
        "credits": 2,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Friday", "period": "6, 7, 8, 9", "time": "01:30 - 05:05", "room": "IST 20,21", "slot": "Workshop"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21PDM102L",
        "course_name": "General Aptitude",
        "credits": 0,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "2", "time": "09:55 - 10:45", "room": "CDC", "slot": "CDC"},
            {"day": "Wednesday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST510", "slot": "CDC"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21GNM102L",
        "course_name": "NSS",
        "credits": 0,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Tuesday", "period": "3, 4", "time": "10:50 - 12:35", "room": "201", "slot": "NSS"}
        ]
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "course_code": "21BTB103T",
        "course_name": "Biology",
        "credits": 2,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST710", "slot": "F"},
            {"day": "Thursday", "period": "1", "time": "09:00 - 09:50", "room": "IST710", "slot": "F"}
        ]
    },

    # -------------------------------------------------------------
    # PAGE 4: I Biotech-B; Biomed. Engg.
    # -------------------------------------------------------------
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21LEH105T",
        "course_name": "Japanese",
        "credits": 3,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Thursday", "period": "8, 9", "time": "03:20 - 05:05", "room": "IST702", "slot": "Japanese"},
            {"day": "Friday", "period": "4", "time": "11:45 - 12:35", "room": "IST702", "slot": "Japanese"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21GNH101J",
        "course_name": "Philosophy of Engineering",
        "credits": 2,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "6, 7", "time": "01:30 - 03:15", "room": "IST702", "slot": "E"},
            {"day": "Wednesday", "period": "8", "time": "03:20 - 04:10", "room": "IST702", "slot": "E"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21MAB102T",
        "course_name": "Advanced Calculus and Complex Analysis",
        "credits": 4,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "8", "time": "03:20 - 04:10", "room": "IST702", "slot": "A"},
            {"day": "Tuesday", "period": "8", "time": "03:20 - 04:10", "room": "IST702", "slot": "A"},
            {"day": "Thursday", "period": "4", "time": "11:45 - 12:35", "room": "IST710", "slot": "A"},
            {"day": "Friday", "period": "3", "time": "10:50 - 11:40", "room": "IST702", "slot": "A"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21CYB101J",
        "course_name": "Chemistry",
        "credits": 5,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "9", "time": "04:15 - 05:05", "room": "IST702", "slot": "B"},
            {"day": "Tuesday", "period": "7", "time": "02:25 - 03:15", "room": "IST702", "slot": "B"},
            {"day": "Wednesday", "period": "7", "time": "02:25 - 03:15", "room": "IST702", "slot": "B"},
            {"day": "Thursday", "period": "1, 2, 3", "time": "09:00 - 11:40", "room": "Che lab", "slot": "Lab"},
            {"day": "Thursday", "period": "7", "time": "02:25 - 03:15", "room": "IST702", "slot": "B"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21CSS101J",
        "course_name": "Programming for Problem Solving",
        "credits": 4,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Tuesday", "period": "9", "time": "04:15 - 05:05", "room": "IST702", "slot": "D"},
            {"day": "Wednesday", "period": "6", "time": "01:30 - 02:20", "room": "IST702", "slot": "D"},
            {"day": "Wednesday", "period": "9", "time": "04:15 - 05:05", "room": "IST702", "slot": "D"},
            {"day": "Friday", "period": "8, 9", "time": "03:20 - 05:05", "room": "PPS LAB", "slot": "Lab"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21BTC105T",
        "course_name": "Cell biology (for Biotech)",
        "credits": 2,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "1", "time": "09:00 - 09:50", "room": "IST520", "slot": "C"},
            {"day": "Tuesday", "period": "3", "time": "10:50 - 11:40", "room": "IST520", "slot": "C"},
            {"day": "Thursday", "period": "6", "time": "01:30 - 02:20", "room": "IST510", "slot": "C"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21BTB104T",
        "course_name": "Biology: Human physiology and anatomy (only for Biomedical Engineering)",
        "credits": 2,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "4", "time": "11:45 - 12:35", "room": "IST520", "slot": "G"},
            {"day": "Thursday", "period": "6", "time": "01:30 - 02:20", "room": "IST520", "slot": "G"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21BTC101T",
        "course_name": "Biochemistry (for Biotech)",
        "credits": 3,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "4", "time": "11:45 - 12:35", "room": "IST710", "slot": "F"},
            {"day": "Tuesday", "period": "4", "time": "11:45 - 12:35", "room": "IST710", "slot": "F"},
            {"day": "Friday", "period": "1", "time": "09:00 - 09:50", "room": "IST702", "slot": "F"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21MES101L",
        "course_name": "Basic Civil and Mechanical Workshop",
        "credits": 2,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Wednesday", "period": "1, 2, 3, 4", "time": "09:00 - 12:35", "room": "IST 20,21", "slot": "Workshop"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21PDM102L",
        "course_name": "General Aptitude",
        "credits": 0,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Tuesday", "period": "1, 2", "time": "09:00 - 10:45", "room": "IST710", "slot": "CDC"},
            {"day": "Friday", "period": "2", "time": "09:55 - 10:45", "room": "IST702", "slot": "CDC"}
        ]
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "course_code": "21GNM101L",
        "course_name": "Physical and Mental Health using Yoga",
        "credits": 0,
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "timetable": [
            {"day": "Monday", "period": "2, 3", "time": "09:55 - 11:40", "room": "YOGA", "slot": "Yoga"}
        ]
    }
]

# Section-level full 5-day timetable grids
section_grids = [
    {
        "department": "Electronics and Communication Engineering",
        "year": "1",
        "section": "ECE-A",
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "weekly_schedule": {
            "Monday": {
                "Period 1 (09:00-09:50)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST602"},
                "Period 2 (09:55-10:45)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST602"},
                "Period 3 (10:50-11:40)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST602"},
                "Period 4 (11:45-12:35)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST602"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21CYB101J", "name": "Chemistry Lab", "slot": "Che lab", "room": "Che lab"},
                "Period 7 (02:25-03:15)": {"code": "21CYB101J", "name": "Chemistry Lab", "slot": "Che lab", "room": "Che lab"},
                "Period 8 (03:20-04:10)": {"code": "21BTB103T", "name": "Biology", "slot": "F", "room": "IST710"},
                "Period 9 (04:15-05:05)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST710"}
            },
            "Tuesday": {
                "Period 1 (09:00-09:50)": {"code": "21BTB102J", "name": "Electronic System and PCB Design", "slot": "C", "room": "IST602"},
                "Period 2 (09:55-10:45)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST602"},
                "Period 3 (10:50-11:40)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST602"},
                "Period 4 (11:45-12:35)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST602"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21MES101L", "name": "Basic Civil and Mechanical Workshop", "room": "IST 20,21"},
                "Period 7 (02:25-03:15)": {"code": "21MES101L", "name": "Basic Civil and Mechanical Workshop", "room": "IST 20,21"},
                "Period 8 (03:20-04:10)": {"code": "21MES101L", "name": "Basic Civil and Mechanical Workshop", "room": "IST 20,21"},
                "Period 9 (04:15-05:05)": None
            },
            "Wednesday": {
                "Period 1 (09:00-09:50)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST602"},
                "Period 2 (09:55-10:45)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST602"},
                "Period 3 (10:50-11:40)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST602"},
                "Period 4 (11:45-12:35)": None,
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "IST 618"},
                "Period 7 (02:25-03:15)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "IST 618"},
                "Period 8 (03:20-04:10)": {"code": "21BTB102J", "name": "PCB Lab", "room": "IST 108"},
                "Period 9 (04:15-05:05)": {"code": "21BTB102J", "name": "PCB Lab", "room": "IST 108"}
            },
            "Thursday": {
                "Period 1 (09:00-09:50)": {"code": "21LEH104T", "name": "German", "room": "IST602"},
                "Period 2 (09:55-10:45)": {"code": "21LEH104T", "name": "German", "room": "IST602"},
                "Period 3 (10:50-11:40)": {"code": "21LEH104T", "name": "German", "room": "IST602"},
                "Period 4 (11:45-12:35)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST602"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST510"},
                "Period 7 (02:25-03:15)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST510"},
                "Period 8 (03:20-04:10)": {"code": "21GNM102L", "name": "NSS", "room": "IST201"},
                "Period 9 (04:15-05:05)": {"code": "21GNM102L", "name": "NSS", "room": "IST201"}
            },
            "Friday": {
                "Period 1 (09:00-09:50)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST602"},
                "Period 2 (09:55-10:45)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST602"},
                "Period 3 (10:50-11:40)": {"code": "21BTB102J", "name": "Electronic System and PCB Design", "slot": "C", "room": "IST602"},
                "Period 4 (11:45-12:35)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST602"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21BTB103T", "name": "Biology", "slot": "F", "room": "IST602"},
                "Period 7 (02:25-03:15)": {"code": "21LEH104T", "name": "German", "room": "IST626"},
                "Period 8 (03:20-04:10)": {"code": "21LEH104T", "name": "German", "room": "IST626"},
                "Period 9 (04:15-05:05)": None
            }
        }
    },
    {
        "department": "Electronics and Communication Engineering / Electrical and Electronics Engineering",
        "year": "1",
        "section": "ECE-B & EEE",
        "semester": "Odd Semester (2024-25)",
        "semester_start_date": "2024-08-05",
        "semester_end_date": "2024-12-20",
        "weekly_schedule": {
            "Monday": {
                "Period 1 (09:00-09:50)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST609"},
                "Period 2 (09:55-10:45)": {"ECE": {"code": "21BTB102J", "slot": "F", "room": "IST710"}, "EEE": {"code": "21EEC101J", "slot": "G", "room": "IST520"}},
                "Period 3 (10:50-11:40)": {"code": "21CYB101J", "name": "Chemistry Lab", "room": "Che lab"},
                "Period 4 (11:45-12:35)": {"code": "21CYB101J", "name": "Chemistry Lab", "room": "Che lab"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST602"},
                "Period 7 (02:25-03:15)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST602"},
                "Period 8 (03:20-04:10)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST602"},
                "Period 9 (04:15-05:05)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST602"}
            },
            "Tuesday": {
                "Period 1 (09:00-09:50)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 2 (09:55-10:45)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 3 (10:50-11:40)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 4 (11:45-12:35)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21BTB103T", "name": "Biology", "slot": "C", "room": "IST602"},
                "Period 7 (02:25-03:15)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST602"},
                "Period 8 (03:20-04:10)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST602"},
                "Period 9 (04:15-05:05)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST602"}
            },
            "Wednesday": {
                "Period 1 (09:00-09:50)": {"ECE": {"code": "21BTB102J", "slot": "F", "room": "IST710"}, "EEE": {"code": "21EEC101J", "slot": "G", "room": "IST520"}},
                "Period 2 (09:55-10:45)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "IST 617"},
                "Period 3 (10:50-11:40)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST510"},
                "Period 4 (11:45-12:35)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST510"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "IST618"},
                "Period 7 (02:25-03:15)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST602"},
                "Period 8 (03:20-04:10)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST602"},
                "Period 9 (04:15-05:05)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST602"}
            },
            "Thursday": {
                "Period 1 (09:00-09:50)": {"code": "21GNM102L", "name": "NSS", "room": "201"},
                "Period 2 (09:55-10:45)": {"code": "21GNM102L", "name": "NSS", "room": "201"},
                "Period 3 (10:50-11:40)": {"code": "21BTB103T", "name": "Biology", "slot": "C", "room": "IST626"},
                "Period 4 (11:45-12:35)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST710"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST602"},
                "Period 7 (02:25-03:15)": {"code": "21LEH104T", "name": "German", "room": "IST602"},
                "Period 8 (03:20-04:10)": {"code": "21LEH104T", "name": "German", "room": "IST602"},
                "Period 9 (04:15-05:05)": None
            },
            "Friday": {
                "Period 1 (09:00-09:50)": {"ECE": {"code": "21BTB102J", "name": "PCB Lab", "room": "IST 617"}, "EEE": {"code": "21EEC101J", "name": "EC Lab", "room": "IST 617"}},
                "Period 2 (09:55-10:45)": {"ECE": {"code": "21BTB102J", "name": "PCB Lab", "room": "IST 617"}, "EEE": {"code": "21EEC101J", "name": "EC Lab", "room": "IST 617"}},
                "Period 3 (10:50-11:40)": None,
                "Period 4 (11:45-12:35)": None,
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21LEH104T", "name": "German", "room": "IST626"},
                "Period 7 (02:25-03:15)": None,
                "Period 8 (03:20-04:10)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST602"},
                "Period 9 (04:15-05:05)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST602"}
            }
        }
    },
    {
        "department": "Electronics and Communication Engineering (Data Science)",
        "year": "1",
        "section": "ECE-DS",
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "weekly_schedule": {
            "Monday": {
                "Period 1 (09:00-09:50)": {"code": "21BTB103T", "name": "Biology", "slot": "F", "room": "IST710"},
                "Period 2 (09:55-10:45)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "CDC"},
                "Period 3 (10:50-11:40)": {"code": "21BTB102J", "name": "PCB Lab", "room": "IST 617"},
                "Period 4 (11:45-12:35)": {"code": "21BTB102J", "name": "PCB Lab", "room": "IST 617"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST502"},
                "Period 7 (02:25-03:15)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST502"},
                "Period 8 (03:20-04:10)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST502"},
                "Period 9 (04:15-05:05)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST502"}
            },
            "Tuesday": {
                "Period 1 (09:00-09:50)": {"code": "21CYB101J", "name": "Chemistry Lab", "room": "Che lab"},
                "Period 2 (09:55-10:45)": {"code": "21CYB101J", "name": "Chemistry Lab", "room": "Che lab"},
                "Period 3 (10:50-11:40)": {"code": "21GNM102L", "name": "NSS", "room": "201"},
                "Period 4 (11:45-12:35)": {"code": "21GNM102L", "name": "NSS", "room": "201"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21BTB102J", "name": "Electronic System and PCB Design", "slot": "C", "room": "IST502"},
                "Period 7 (02:25-03:15)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST502"},
                "Period 8 (03:20-04:10)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST502"},
                "Period 9 (04:15-05:05)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST502"}
            },
            "Wednesday": {
                "Period 1 (09:00-09:50)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST510"},
                "Period 2 (09:55-10:45)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST510"},
                "Period 3 (10:50-11:40)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST710"},
                "Period 4 (11:45-12:35)": None,
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "IST 617"},
                "Period 7 (02:25-03:15)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "IST 617"},
                "Period 8 (03:20-04:10)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST502"},
                "Period 9 (04:15-05:05)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST502"}
            },
            "Thursday": {
                "Period 1 (09:00-09:50)": {"code": "21BTB103T", "name": "Biology", "slot": "F", "room": "IST710"},
                "Period 2 (09:55-10:45)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST510"},
                "Period 3 (10:50-11:40)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST710"},
                "Period 4 (11:45-12:35)": None,
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21LEH104T", "name": "German", "room": "IST502"},
                "Period 7 (02:25-03:15)": None,
                "Period 8 (03:20-04:10)": {"code": "21BTB102J", "name": "Electronic System and PCB Design", "slot": "C", "room": "IST502"},
                "Period 9 (04:15-05:05)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST502"}
            },
            "Friday": {
                "Period 1 (09:00-09:50)": {"code": "21LEH104T", "name": "German", "room": "IST626"},
                "Period 2 (09:55-10:45)": {"code": "21LEH104T", "name": "German", "room": "IST626"},
                "Period 3 (10:50-11:40)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "PPS LAB"},
                "Period 4 (11:45-12:35)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "PPS LAB"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 7 (02:25-03:15)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 8 (03:20-04:10)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 9 (04:15-05:05)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"}
            }
        }
    },
    {
        "department": "Biotechnology & Biomedical Engineering",
        "year": "1",
        "section": "Biotech-B & Biomed. Engg.",
        "semester": "Even Semester (2024-25)",
        "semester_start_date": "2025-01-06",
        "semester_end_date": "2025-05-16",
        "weekly_schedule": {
            "Monday": {
                "Period 1 (09:00-09:50)": {"Biotech": {"code": "21BTC105T", "slot": "C", "room": "IST520"}},
                "Period 2 (09:55-10:45)": {"code": "21GNM101L", "name": "Physical and Mental Health using Yoga", "room": "YOGA"},
                "Period 3 (10:50-11:40)": {"code": "21GNM101L", "name": "Physical and Mental Health using Yoga", "room": "YOGA"},
                "Period 4 (11:45-12:35)": {"Biotech": {"code": "21BTC101T", "slot": "F", "room": "IST710"}, "Biomedical": {"code": "21BTB104T", "slot": "G", "room": "IST520"}},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST702"},
                "Period 7 (02:25-03:15)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST702"},
                "Period 8 (03:20-04:10)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST702"},
                "Period 9 (04:15-05:05)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST702"}
            },
            "Tuesday": {
                "Period 1 (09:00-09:50)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST710"},
                "Period 2 (09:55-10:45)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST710"},
                "Period 3 (10:50-11:40)": {"Biotech": {"code": "21BTC105T", "slot": "C", "room": "IST520"}},
                "Period 4 (11:45-12:35)": {"Biotech": {"code": "21BTC101T", "slot": "F", "room": "IST710"}},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": None,
                "Period 7 (02:25-03:15)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST702"},
                "Period 8 (03:20-04:10)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST702"},
                "Period 9 (04:15-05:05)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST702"}
            },
            "Wednesday": {
                "Period 1 (09:00-09:50)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 2 (09:55-10:45)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 3 (10:50-11:40)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 4 (11:45-12:35)": {"code": "21MES101L", "name": "Workshop", "room": "IST 20,21"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST702"},
                "Period 7 (02:25-03:15)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST702"},
                "Period 8 (03:20-04:10)": {"code": "21GNH101J", "name": "Philosophy of Engineering", "slot": "E", "room": "IST702"},
                "Period 9 (04:15-05:05)": {"code": "21CSS101J", "name": "Programming for Problem Solving", "slot": "D", "room": "IST702"}
            },
            "Thursday": {
                "Period 1 (09:00-09:50)": {"code": "21CYB101J", "name": "Chemistry Lab", "room": "Che lab"},
                "Period 2 (09:55-10:45)": {"code": "21CYB101J", "name": "Chemistry Lab", "room": "Che lab"},
                "Period 3 (10:50-11:40)": {"code": "21CYB101J", "name": "Chemistry Lab", "room": "Che lab"},
                "Period 4 (11:45-12:35)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST710"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": {"Biotech": {"code": "21BTC105T", "slot": "C", "room": "IST510"}, "Biomedical": {"code": "21BTB104T", "slot": "G", "room": "IST520"}},
                "Period 7 (02:25-03:15)": {"code": "21CYB101J", "name": "Chemistry", "slot": "B", "room": "IST702"},
                "Period 8 (03:20-04:10)": {"code": "21LEH105T", "name": "Japanese", "room": "IST702"},
                "Period 9 (04:15-05:05)": {"code": "21LEH105T", "name": "Japanese", "room": "IST702"}
            },
            "Friday": {
                "Period 1 (09:00-09:50)": {"code": "21BTC101T", "name": "Biochemistry", "slot": "F", "room": "IST702"},
                "Period 2 (09:55-10:45)": {"code": "21PDM102L", "name": "General Aptitude", "slot": "CDC", "room": "IST702"},
                "Period 3 (10:50-11:40)": {"code": "21MAB102T", "name": "Advanced Calculus and Complex Analysis", "slot": "A", "room": "IST702"},
                "Period 4 (11:45-12:35)": {"code": "21LEH105T", "name": "Japanese", "room": "IST702"},
                "Period 5 (12:35-01:30)": {"name": "Lunch Break"},
                "Period 6 (01:30-02:20)": None,
                "Period 7 (02:25-03:15)": None,
                "Period 8 (03:20-04:10)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "PPS LAB"},
                "Period 9 (04:15-05:05)": {"code": "21CSS101J", "name": "Programming for Problem Solving Lab", "room": "PPS LAB"}
            }
        }
    }
]

# Write JSON output
json_path = "supabase_timetable_data.json"
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(course_records, f, indent=2, ensure_ascii=False)
print(f"Generated {json_path} with {len(course_records)} course records.")

section_json_path = "supabase_section_timetables.json"
with open(section_json_path, "w", encoding="utf-8") as f:
    json.dump(section_grids, f, indent=2, ensure_ascii=False)
print(f"Generated {section_json_path} with {len(section_grids)} section grids.")

# Write CSV output (for direct Supabase UI import)
csv_path = "supabase_timetable_data.csv"
fieldnames = [
    "department",
    "year",
    "section",
    "course_code",
    "course_name",
    "credits",
    "semester",
    "timetable",
    "semester_start_date",
    "semester_end_date"
]

with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for row in course_records:
        writer.writerow({
            "department": row["department"],
            "year": row["year"],
            "section": row["section"],
            "course_code": row["course_code"],
            "course_name": row["course_name"],
            "credits": row["credits"],
            "semester": row["semester"],
            "timetable": json.dumps(row["timetable"]),
            "semester_start_date": row["semester_start_date"],
            "semester_end_date": row["semester_end_date"]
        })
print(f"Generated {csv_path} with {len(course_records)} rows.")

# Write Supabase PostgreSQL SQL script
sql_path = "supabase_schema_and_data.sql"
with open(sql_path, "w", encoding="utf-8") as f:
    f.write("""-- ==============================================================================
-- SUPABASE TIMETABLE SCHEMA & DATA SCRIPT
-- Institution: SRM Institute of Science and Technology, Tiruchirappalli Campus
-- Faculty of Engineering and Technology
-- ==============================================================================

-- 1. Create table matching EXACT requested fields:
--    Department, Year, Section, Course code, Course name, Credits, Semester,
--    Timetable, Semester start date, Semester end date
CREATE TABLE IF NOT EXISTS public.timetable_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    section TEXT NOT NULL,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    semester TEXT NOT NULL,
    timetable JSONB NOT NULL DEFAULT '[]'::jsonb,
    semester_start_date DATE,
    semester_end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance indexes for lightning fast queries in Supabase
CREATE INDEX IF NOT EXISTS idx_timetable_department ON public.timetable_records(department);
CREATE INDEX IF NOT EXISTS idx_timetable_year_sec ON public.timetable_records(year, section);
CREATE INDEX IF NOT EXISTS idx_timetable_course_code ON public.timetable_records(course_code);
CREATE INDEX IF NOT EXISTS idx_timetable_semester ON public.timetable_records(semester);
CREATE INDEX IF NOT EXISTS idx_timetable_gin ON public.timetable_records USING gin (timetable);

-- 3. Row Level Security (RLS) policies (Supabase Best Practice)
ALTER TABLE public.timetable_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on timetable_records" 
ON public.timetable_records
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated users full access on timetable_records" 
ON public.timetable_records 
FOR ALL 
TO authenticated 
USING (true);

-- 4. Clean previous test data if re-running
TRUNCATE TABLE public.timetable_records;

-- 5. Insert timetable dataset (42 courses across 4 sections)
INSERT INTO public.timetable_records (
    department,
    year,
    section,
    course_code,
    course_name,
    credits,
    semester,
    timetable,
    semester_start_date,
    semester_end_date
) VALUES
""")
    values_list = []
    for row in course_records:
        dept = row["department"].replace("'", "''")
        yr = row["year"].replace("'", "''")
        sec = row["section"].replace("'", "''")
        c_code = row["course_code"].replace("'", "''")
        c_name = row["course_name"].replace("'", "''")
        credits = row["credits"]
        sem = row["semester"].replace("'", "''")
        tt_json = json.dumps(row["timetable"]).replace("'", "''")
        s_start = f"'{row['semester_start_date']}'" if row.get("semester_start_date") else "NULL"
        s_end = f"'{row['semester_end_date']}'" if row.get("semester_end_date") else "NULL"

        values_list.append(
            f"('{dept}', '{yr}', '{sec}', '{c_code}', '{c_name}', {credits}, '{sem}', '{tt_json}'::jsonb, {s_start}, {s_end})"
        )

    f.write(",\n".join(values_list))
    f.write(";\n\n")

    f.write("""-- ==============================================================================
-- 6. Optional Table: Section-Level Master Timetables (Full 5-Day Weekly Grid)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.section_timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    section TEXT NOT NULL,
    semester TEXT NOT NULL,
    semester_start_date DATE,
    semester_end_date DATE,
    timetable JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.section_timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on section_timetables" 
ON public.section_timetables FOR SELECT TO public USING (true);

TRUNCATE TABLE public.section_timetables;

INSERT INTO public.section_timetables (
    department,
    year,
    section,
    semester,
    semester_start_date,
    semester_end_date,
    timetable
) VALUES
""")
    sec_values = []
    for s in section_grids:
        dept = s["department"].replace("'", "''")
        yr = s["year"].replace("'", "''")
        sec = s["section"].replace("'", "''")
        sem = s["semester"].replace("'", "''")
        s_start = f"'{s['semester_start_date']}'"
        s_end = f"'{s['semester_end_date']}'"
        tt_grid_json = json.dumps(s["weekly_schedule"]).replace("'", "''")
        sec_values.append(
            f"('{dept}', '{yr}', '{sec}', '{sem}', {s_start}, {s_end}, '{tt_grid_json}'::jsonb)"
        )

    f.write(",\n".join(sec_values))
    f.write(";\n\n")

    f.write("""-- ==============================================================================
-- 7. Helper View: Unnest timetable slots into individual schedule rows
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

COMMENT ON TABLE public.timetable_records IS 'Timetable records matching exact user specifications';
COMMENT ON TABLE public.section_timetables IS 'Master section timetables with full 5-day period grids';
""")

print(f"Generated {sql_path} successfully.")
