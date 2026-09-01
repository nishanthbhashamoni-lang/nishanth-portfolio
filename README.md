# Nishanth Bhashamoni — Personal Portfolio + Dynamic Admin System

A modern, high-performance personal portfolio with a **secure Admin Management System** built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **SQLite**, **bcrypt**, **JWT**, and **Multer**.

---

## 🚀 Quick Start

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and set your secure environment variables:
```bash
cp .env.example .env
```

Ensure `JWT_SECRET` is set to a cryptographically strong random string in production.

### 2. Start Backend API & Frontend Client Concurrently
```bash
npm run dev
```
- **Public Portfolio**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔐 Admin Portal & Security Management

To access the protected management dashboard:
1. Navigate to `/admin` in your browser (or click **"Admin Portal"** in the footer).
2. Sign in with your configured admin credentials.
3. If using initial setup credentials, update your password immediately using the **"Password"** modal before deploying to production.

---

## ✨ Features & Architecture

### 1. Dynamic Resume Management (`/admin` -> Resume)
- **Upload & Replace**: Upload your official resume PDF directly through the admin dashboard with persistent storage in `server/uploads/resume/`.
- **Delete & Preview**: View uploaded date, file size, download, or delete the resume.
- **Public Buttons**:
  - Top "Resume" button serves PDF inline (`/api/resume/view`) to view directly in the browser.
  - "Download Resume" buttons trigger attachment download (`/api/resume/download`).
  - If no resume is active, public buttons display a clean, non-disruptive notification toast without breaking.

### 2. Dynamic Categories System (`/admin` -> Categories)
- Create, edit, and delete custom categories (e.g. `Data Analytics`, `Data Visualization`, `AI / ML`, `Content Writing`).
- Many-to-many database relationship (`project_categories`) links work items across multiple categories.
- Real-time work item count tracking per category.
- Dynamic public category tabs filter work samples with smooth transitions.

### 3. Multi-Discipline Work & Publications (`/admin` -> Projects & Work)
- Add/Edit software projects, articles, scripts, research papers, case studies, or dashboards.
- Assign work items to one or multiple categories.
- Upload project screenshots/mockups or attach sample document PDFs.
- Dedicated support for external publication links (e.g. Medium/blog), GitHub repositories, and live demo links.
- Conditional action buttons: only displays links/buttons when valid URLs or attachments exist.

### 4. Production Security Hardening
- Passwords hashed with `bcryptjs` (12 salt rounds).
- Cryptographic JWT authorization (`verifyAdmin`) on all mutating endpoints (`/api/resume`, `/api/categories`, `/api/projects`, `/api/upload`).
- Rate limiting on `/api/auth/login` to prevent brute-force attacks.
- Public visitor queries are strictly read-only.
- `.env`, SQLite databases, and user uploads are strictly excluded in `.gitignore`.