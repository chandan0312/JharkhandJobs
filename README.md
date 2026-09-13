# 💼 Jharkhand Jobs — Competitive Prep & Career Portal

[![Stack-PostgreSQL](https://img.shields.io/badge/Stack-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Database-Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![React Version](https://img.shields.io/badge/UI-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)](https://react.dev/)
[![Vite Bundler](https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

**Empowering Jharkhand's youth with localized career listings, competitive state exam notifications, and interactive mock tests.**

---

## 📖 Overview

**Jharkhand Jobs** is a modern, high-performance web platform designed to bridge the employment and preparation gap for aspirants and job-seekers in Jharkhand. Equipped with a unified interactive dashboard, it provides:

* 🏛️ **Government Exams & Alerts**: Real-time tracking of state recruitments (JPSC, JSSC, State Police) with upcoming dates, admit cards, and results.
* 💼 **Private Careers Portal**: Filterable listings for private jobs across major cities in Jharkhand (Ranchi, Jamshedpur, Dhanbad, Bokaro) with direct resume submission.
* 📝 **Interactive Exam Simulator**: Mock exam engine featuring countdown timers, categorised question banks, progress trackers, and instant explanations.
* 👑 **Unified Control Panel**: Secure admin dashboard for complete CRUD management of jobs, mock tests, exams, blogs, and applicant profiles.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, React Router 7, Recharts, Lucide Icons, Vite 8, and Modern CSS Variables.
* **Backend**: Node.js (ES Modules), Express 5, Multer (file handling), and JWT-Cookie authentication.
* **Database**: **Supabase / PostgreSQL** database connected using the `postgres.js` high-performance driver.

---

## ⚙️ Getting Started

### 1. Setup Your Database (Supabase)
1. Create a PostgreSQL project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard, click **New Query**, paste the contents of [backend/schema.sql](./backend/schema.sql) (or run the app, which auto-seeds on startup), and click **Run**.

---

### 2. Configure & Run Backend Server
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   DATABASE_URL=postgresql://postgres.yourref:[PASSWORD]@aws-0-your-region.pooler.supabase.com:6543/postgres
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

---

### 3. Configure & Run Frontend Application
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install UI dependencies:
   ```bash
   npm install
   ```
3. Set your environment URL inside `.env` (defaults to `http://localhost:5000/api`).
4. Start the Vite server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 🔑 Pre-Seeded Accounts

Log in directly to test administrative and candidate features:

| Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@jharkhandjobs.com` | `Admin@123` | Control panels, applicant review, adding jobs/quizzes |
| **Demo Candidate** | `rohan@gmail.com` | `User@123` | Dashboard browsing, taking mock tests, resume upload |

---

<div align="center">
  <p>Developed with ❤️ to support the student and career-seeking community of Jharkhand.</p>
</div>
