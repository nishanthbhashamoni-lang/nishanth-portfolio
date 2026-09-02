# Nishanth Bhashamoni — Personal Portfolio + Dynamic Admin System

A high-performance personal portfolio with a **secure dynamic Admin Management System** built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **SQLite**, **bcrypt**, **JWT**, and **Multer**.

---

## 🚀 Render Web Service Deployment Guide

This project is architected for deployment as a single full-stack **Render Web Service** with an optional **Persistent Disk** for database and uploaded file persistence.

### 1. Render Service Settings
- **Service Type**: Web Service
- **Environment**: Node
- **Build Command**: `npm install --include=dev && npm rebuild sqlite3 --build-from-source && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

### 2. Environment Variables in Render Dashboard
| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode and static React serving |
| `NODE_VERSION` | `20.18.3` | Pinned Node.js 20 LTS runtime |
| `PORT` | `10000` *(or default)* | Render assigns this automatically |
| `HOST` | `0.0.0.0` | Binds server to all network interfaces |
| `DATA_DIR` | `/var/data` *(with Persistent Disk)* | Mount path for SQLite DB and upload storage |
| `JWT_SECRET` | *(Random 32+ char string)* | Cryptographic key for signing admin tokens |
| `ADMIN_USERNAME` | `admin` | Initial admin username on fresh database creation |
| `ADMIN_EMAIL` | `your-email@example.com` | Initial admin recovery email |
| `ADMIN_PASSWORD` | *(Strong custom password)* | Initial admin setup password |

### 3. Persistent Storage on Render (Disks)
To ensure your SQLite database, uploaded resumes, and project images persist across deploys:
1. In your Render Web Service dashboard, navigate to **Disks** -> **Add Disk**.
2. Set **Mount Path**: `/var/data`
3. Set **Size**: 1 GB (or as needed)
4. Ensure the environment variable `DATA_DIR` is set to `/var/data`.

The application will automatically create `/var/data/portfolio.db`, `/var/data/uploads/`, `/var/data/uploads/resume/`, and `/var/data/uploads/files/`.

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
- **Public Portfolio**: [http://localhost:3000](http://localhost:3000)
- **Admin Management**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ✨ Features & Architecture

- **Dynamic Resume Management**: Upload, view (`/api/resume/view`), and download (`/api/resume/download`) PDFs with one-click admin replacement.
- **Dynamic Categories**: Relational many-to-many categories (`project_categories`) with instant client-side filtering.
- **Multi-Discipline Work**: Support for software projects, technical writing, dashboards, and research attachments.
- **Production Hardened**: bcrypt salted hashing, rate limiting, secure cookies, helmet security headers, and zero client-exposed secrets.