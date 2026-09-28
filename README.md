# 📊 AttendanceIQ — The Attendance Predictor
> **VibeCraft 2026 · Round 1: The Overworld**
> Built for students to predict, track, and optimize semester attendance with what-if simulations, AI guidance, and Supabase integration.

---

## 📁 Project Architecture & File Organization

The project is structured into clean, purposeful modules:

```text
yuva/
├── src/                          # React 19 Frontend Application
│   ├── components/               # UI Components (Login, Gauges, Controls, Charts, AI Advisor)
│   ├── data/                     # Section timetables & schedule datasets
│   ├── styles/                   # Core stylesheet & animations
│   └── utils/                    # Calculator engine, Supabase client, Leave simulator
│
├── database/                     # Supabase Schemas, Migrations & Data Exports
│   ├── supabase_master_setup.sql # ⭐️ ALL-IN-ONE SQL setup (Tables, RLS, Seed data)
│   ├── supabase_schema.sql       # Auth & Attendance schema with RLS policies
│   ├── supabase_schema_and_data.sql # Full timetable records for all sections
│   ├── migrations/               # Batch-specific migrations (3rd & 4th year)
│   └── data/                     # Timetable CSVs, JSON exports, & metadata
│
├── scripts/                      # Data Processing & Scraping Pipelines
│   ├── build_master_sql.py       # Compiles master database setup script
│   ├── generate_supabase_export.py # Generates SQL & JSON exports from timetables
│   ├── calc_days.py              # Semester day & period calculator
│   ├── parse_entries.py          # Schedule parser
│   ├── scrapers/                 # Timetable downloaders & fetchers
│   └── raw_dumps/                # Raw scrape payloads & debug dumps
│
├── timetables/                   # Official Timetable PDFs and image scans
├── index.html                    # Single Page App Entrypoint
├── vite.config.js                # Vite Bundler Configuration
├── package.json                  # NPM Dependencies & Scripts
├── .env.example                  # Environment template
└── .env.local                    # Your local environment credentials
```

---

## ⚡ Quick Start (Running Locally)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔌 Connecting Your Supabase Database

The app works **immediately out-of-the-box in Demo Mode** (no database required). 
When you're ready to connect your live Supabase cloud database:

### Step 1: Run the Master SQL Script
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → Select your project.
2. Click **SQL Editor** on the left menu.
3. Open [`database/supabase_master_setup.sql`](./database/supabase_master_setup.sql), copy everything, paste into the editor, and click **RUN**.
   - This creates `students`, `attendance`, `timetable_records`, and `section_timetables` tables.
   - It sets up secure **Row Level Security (RLS)** for the web client.
   - It pre-populates test student accounts and attendance rows.

### Step 2: Configure `.env.local`
In your project root, edit [`.env.local`](./.env.local):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-public-key...
VITE_GEMINI_API_KEY=your-gemini-key (optional for AI chatbot)
```
*(Get your URL and Anon Key from **Project Settings → API**)*

### Step 3: Refresh Your App
Save `.env.local` and refresh **http://localhost:3000**.
The login banner will show **🟢 Connected to Supabase Database**.

---

## 👥 Built-in Test Credentials

| Register Number | Password | Name | Section | Status |
|---|---|---|---|---|
| `DEMO` | `demo` | Demo Student | I-ECE-A | Built-in (Always Works) |
| `21BCE0001` | `password123` | Aarav Sharma | I-ECE-A | Seeded in DB |
| `21BCE0002` | `demo` | Priya Nair | I-ECE-A | Seeded in DB |
| `21BCE0003` | `password123` | Rahul Verma | I-ECE-B | Seeded in DB |

> 💡 Click the **"🎮 Fill Demo Credentials"** button on the login screen to sign in instantly with one click.