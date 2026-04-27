# 🧑‍💼 JobConnect — Job Portal Application

A full-stack job portal built with **React + Node.js + Express + MongoDB**.

---

## 📁 Project Structure

```
jobportal/
├── backend/          ← Express REST API
│   ├── models/       ← Mongoose schemas (User, Job, Application)
│   ├── routes/       ← API routes (auth, jobs, applications, profile)
│   ├── middleware/   ← JWT auth middleware
│   ├── server.js     ← Entry point
│   └── .env          ← Environment config
└── frontend/         ← React application
    └── src/
        ├── pages/    ← Home, Jobs, JobDetail, Login, Register, Dashboard, PostJob, Profile
        ├── components/← Navbar, JobCard
        └── context/  ← AuthContext (global state)
```

---

## ⚙️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18, React Router v6 |
| Backend   | Node.js, Express.js     |
| Database  | MongoDB + Mongoose      |
| Auth      | JWT + bcryptjs          |
| Styling   | Pure CSS (no frameworks)|
| DevOps    | Docker (MongoDB)        |

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v16+
- Docker & Docker Desktop (for MongoDB)

### 1. Start MongoDB with Docker

```bash
# Start MongoDB container on port 27017
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps
```

To stop MongoDB later:
```bash
docker stop mongodb
docker rm mongodb
```

### 2. Backend Setup

```bash
cd backend
npm install

# The .env file is already configured for local MongoDB:
# MONGO_URI=mongodb://localhost:27017/jobportal

# Start with nodemon (auto-reload)
npx nodemon server.js
# OR
npm run dev

# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start

# Frontend runs on http://localhost:3000
```

---

## 🔑 Features

### Job Seeker
- Register / Login
- Browse & search jobs (by title, skills, location, type, category)
- View job details
- Apply with cover letter
- Track application status (Applied → Reviewed → Shortlisted → Hired)
- Edit profile (skills, resume/portfolio URL)

### Employer / Recruiter
- Register / Login as employer
- Post new jobs (title, type, salary, skills, requirements)
- View all applicants per job
- Update applicant status
- Delete job listings

---

## 🔗 API Endpoints

| Method | Endpoint                          | Description               | Auth     |
|--------|-----------------------------------|---------------------------|----------|
| POST   | /api/auth/register                | Register new user         | No       |
| POST   | /api/auth/login                   | Login                     | No       |
| GET    | /api/jobs                         | List/search jobs          | No       |
| GET    | /api/jobs/:id                     | Get job by ID             | No       |
| POST   | /api/jobs                         | Post a job                | Employer |
| PUT    | /api/jobs/:id                     | Update job                | Employer |
| DELETE | /api/jobs/:id                     | Delete job                | Employer |
| GET    | /api/jobs/employer/mine           | Employer's own jobs       | Employer |
| POST   | /api/applications/:jobId          | Apply to a job            | Seeker   |
| GET    | /api/applications/my              | My applications           | Seeker   |
| GET    | /api/applications/job/:jobId      | Applicants for a job      | Employer |
| PUT    | /api/applications/:id/status      | Update applicant status   | Employer |
| GET    | /api/profile/me                   | Get my profile            | Any      |
| PUT    | /api/profile/me                   | Update my profile         | Any      |
