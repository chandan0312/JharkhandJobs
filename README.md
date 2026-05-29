# 💼 Jharkhand Jobs — Competitive Prep & Career Portal

<div align="center">

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-React?style=for-the-badge&logo=react&logoColor=61DAFB&color=20232A)](https://reactjs.org/)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20+-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <strong>Empowering Jharkhand's youth with localized career listings, competitive state exam notifications, and interactive mock tests.</strong>
</p>

<h4>
  <a href="#-key-features">Key Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-directory-structure">Directory Structure</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-endpoints">API Routes</a> •
  <a href="#-database-cheatsheet">Database Cheatsheet</a>
</h4>

</div>

---

## 📖 Overview

**Jharkhand Jobs** is a modern, high-performance web platform designed to bridge the employment and preparation gap for aspirants and job-seekers in Jharkhand. Built on the powerful **MERN Stack (MongoDB, Express, React, Node.js)** and bundled with **Vite**, the application offers two core portals in a single unified dashboard:

1. 🏛️ **Government Exams & Alerts Portal**: Direct tracking of state-level recruitments (JPSC, JSSC, State Police, Civil Services) with upcoming dates, syllabus updates, admit card releases, and instant results.
2. 💼 **Private Job Search Portal**: Filterable listings for private careers spanning various cities in Jharkhand (Ranchi, Jamshedpur, Dhanbad, Bokaro, etc.) with in-app resume submission.
3. 📝 **Interactive Mock Exam Engine**: Advanced quiz platform equipped with countdown timers, categorised question banks, instant scorecard calculations, and subject-wise reviews to aid candidate preparation.
4. 👑 **Robust Admin Panel**: Complete, secure management dashboard giving administrators full CRUD control over Job listings, Quizzes, Blogs, Exams, and Applicant resumes, complete with data indicators.

---

## 🚀 Key Features

### 💻 User & Aspirant Dashboard
* **Dynamic Search & Multi-Filters**: Narrow down private career opportunities by category, region, experience level, salary brackets, and industry.
* **Sarkari Exam Notification Tracker**: Instant access to verified recruitment calendars, active application deadlines, direct admit card downloads, and keys/results.
* **Full-Fledged Quiz Simulator**: Simulates high-stakes competitive examinations (like JPSC/JSSC Prelims) with category filters (Jharkhand GK, Science, Math, General Studies), progress bars, stopwatch interfaces, and deep-dive result explanations.
* **Clean In-App Apply**: Seamless resume/profile upload via integrated file-handling systems, directly routed to recruitment databases.
* **Integrated Preparation Blogs**: Highly descriptive syllabus breakdowns, prep guides, and industry articles to guide aspirants on their journey.

### 🛡️ Unified Admin Administration
* **Interactive Statistics Counters**: Real-time counts of total active jobs, registered candidates, pending applications, active exams, and blogs.
* **State & Entity CRUD Management**: Add, update, draft, or delete Jobs, Exams, Blogs, and Quizzes through unified modern tabular forms.
* **Applicant Monitor**: Instantly view resumes and detail panels of all applicants with links for direct profile validation.

---

## 🛠️ Tech Stack

### Frontend Architecture
* **React 19 & React Router 7**: Component-driven UI framework with rapid dynamic declarative routing.
* **Vite 8**: Next-generation lightning-fast frontend bundler enabling hot module replacement (HMR).
* **Lucide React**: Premium curated icons for a gorgeous, polished visual experience.
* **Recharts**: Beautiful interactive charts and visual graphs for rendering user scores and admin telemetry.
* **Vanilla CSS Modern Tokens**: Custom-designed, premium CSS properties featuring elegant grids, micro-interactions, custom animations, and a cohesive HSL system.

### Backend Infrastructure
* **Node.js (ES Modules)**: High-performance runtime configured with modern ES6 import/export modular syntax.
* **Express 5**: Lightweight, robust routing framework for serving Rest APIs.
* **Mongoose 9**: Object Data Modeling (ODM) library for strict, type-safe database schemas and operations.
* **MongoDB**: NoSQL database for rapid JSON-based document storage.
* **Multer**: Multi-part form-data middleware for handling file uploads (candidate resumes).
* **JWT & Cookie Parser**: Secure, token-based stateful authentication via HTTP-only cookies.

---

## 📂 Directory Structure

Below is an overview of the project structure, showcasing the clear separation of concerns between client and server layers:

```text
JharkhandJobs/
├── backend/                  # REST API Server Source Code
│   ├── config/               # Database configurations & connection parameters
│   ├── middleware/           # Route guards (Admin verify, Auth guards)
│   ├── models/               # MongoDB/Mongoose Schemas (User, Job, Quiz, etc.)
│   ├── routes/               # API endpoint modules
│   ├── seed/                 # Pre-configured seed scripts for sample data
│   ├── services/             # Helper business logic and utilities
│   ├── uploads/              # Storage directory for candidate resumes
│   ├── .env.example          # Template for required environment variables
│   ├── server.js             # Express API Server entrypoint
│   └── package.json          # Node scripts and dependencies
│
├── frontend/                 # Vite + React Single Page App
│   ├── public/               # Global static public assets
│   ├── src/
│   │   ├── components/       # Reusable interactive components
│   │   ├── pages/            # View pages (Home, Jobs, Quiz, Admin dashboard)
│   │   ├── utils/            # Language files, helpers, and translations
│   │   ├── App.jsx           # Main React App component
│   │   └── main.jsx          # React app entry point and DOM mounting
│   ├── index.html            # Core SPA HTML entry template
│   ├── vite.config.js        # Vite bundler parameters
│   └── package.json          # UI dependencies & scripts
│
├── mongodb_crud_guide.md     # 📚 Interactive database cheatsheet & guide
├── .gitignore                # Global workspace gitignore
└── README.md                 # 🏆 Project documentation (You are here!)
```

---

## ⚙️ Getting Started

Follow these step-by-step instructions to get your local environment running.

### 📋 Prerequisites
Make sure you have the following installed on your operating system:
* **Node.js** (v20.x or higher recommended)
* **MongoDB Community Server** (running locally on port `27017`)
* **npm** (comes bundled with Node.js)

---

### 🗄️ Step 1: Database Setup
1. Start your local MongoDB service:
   * **Windows (PowerShell)**: Ensure MongoDB is running via Services or by running `mongod` in your terminal.
2. Verify you can connect using the MongoDB shell:
   ```bash
   mongosh
   ```
3. To view or manually manipulate database records, refer directly to our interactive [MongoDB CRUD Operations Reference Guide](./mongodb_crud_guide.md).

---

### 🛡️ Step 2: Backend Installation & Seeding
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install server-side dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   * Copy the template `.env.example` into a new `.env` file:
     ```bash
     cp .env.example .env
     ```
   * Open `.env` and verify the values. Under standard setups, the default database connection string `mongodb://127.0.0.1:27017/jharkhand_jobs` works out of the box.
4. **Seed the database** with sample users (admin/user accounts), jobs, quizzes, and exams:
   ```bash
   npm run seed
   ```
   *This cleans any previous collections and inserts rich, pre-configured mocks so you can test features instantly.*
5. Launch the backend API Server in development mode:
   ```bash
   npm run dev
   ```
   *The backend should load successfully on `http://localhost:5000` with the console displaying: `Server running in development mode on port 5000`.*

---

### 💻 Step 3: Frontend Installation & Launch
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install user-interface dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app by opening your browser and navigating to the local address displayed (typically `http://localhost:5173`).

---

## 🔑 Default Accounts (Seeded Data)

To log in and immediately test both roles inside the application, use these pre-seeded credentials:

| Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@jharkhandjobs.com` | `Admin@123` | Full control over CRUD panels, candidate review, metrics. |
| **Demo Candidate** | `rohan@gmail.com` | `User@123` | Dashboard browsing, taking mock quizzes, resume uploads. |

---

## 📡 API Endpoints

Below is a summary of the backend API routes configured inside `backend/server.js`:

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Registers a new user/candidate.
* `POST /api/auth/login` — Authenticates user and issues HTTP-only JWT Cookie.
* `GET /api/auth/logout` — Destroys session token.
* `GET /api/auth/profile` — Retrieves active logged-in user profile.

### 💼 Jobs Board (`/api/jobs`)
* `GET /api/jobs` — Retrieve active jobs with custom category/region queries.
* `GET /api/jobs/:id` — Retrieve comprehensive single job requirements.
* `POST /api/jobs` — *(Admin Only)* Create new private career posting.
* `PUT /api/jobs/:id` — *(Admin Only)* Update job details.
* `DELETE /api/jobs/:id` — *(Admin Only)* Terminate/remove job posting.

### 🏛️ Exams Calendar (`/api/exams`)
* `GET /api/exams` — Lists all scheduled Sarkari notifications.
* `POST /api/exams` — *(Admin Only)* Add a competitive state alert.
* `DELETE /api/exams/:id` — *(Admin Only)* Archive/remove notification.

### 📝 Quiz Engine (`/api/quizzes`)
* `GET /api/quizzes` — Fetch practice modules and questions.
* `POST /api/quizzes` — *(Admin Only)* Add mock exam prep question set.
* `DELETE /api/quizzes/:id` — *(Admin Only)* Delete a quiz set.

### 📑 Career Applications (`/api/applications`)
* `POST /api/applications/apply/:jobId` — Submit online application with resume upload (Multer integration).
* `GET /api/applications/my-applications` — Candidate review of submitted jobs.
* `GET /api/applications/all` — *(Admin Only)* Overview of all candidate applications state-wide.

---

## 📚 Database Cheatsheet

For detailed instructions on running manual database diagnostics, checking collections, adding administrative entries directly via terminal, or setting up a graphical interface like MongoDB Compass, click to view the:
👉 **[MongoDB CRUD Operations Reference Guide](./mongodb_crud_guide.md)**

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Developed with ❤️ to empower the student and career-seeking community of Jharkhand.</p>
</div>
