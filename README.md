# Nishanth Bhashamoni — Personal Portfolio + Dynamic Admin System

A high-performance personal portfolio with a **secure dynamic Admin Management System** built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **Turso (Serverless SQLite)**, **Vercel Blob Storage**, **bcrypt**, **JWT**, and **Multer**.

---

## 🚀 Vercel Free Tier ($0/mo) Deployment Guide

This project is architected to run **100% free** on Vercel serverless infrastructure with **Turso Serverless SQLite** and **Vercel Blob Storage**.

### Step 1: Create Free Turso Database (30 seconds)
1. Go to **[turso.tech](https://turso.tech)** and sign in with GitHub ($0 Free Tier: 9 GB storage).
2. Create a new database named `nishanth-portfolio`.
3. Copy your:
   - **Database URL**: `libsql://nishanth-portfolio-<username>.turso.io`
   - **Auth Token**: Click "Create Token" and copy the token.

### Step 2: Deploy on Vercel
1. Import your GitHub repository (`nishanth-portfolio`) into **[Vercel](https://vercel.com)**.
2. Framework Preset: **Vite** (detected automatically).
3. Under **Environment Variables**, add:
   - `TURSO_DATABASE_URL` -> `libsql://nishanth-portfolio-<username>.turso.io`
   - `TURSO_AUTH_TOKEN` -> `<your_turso_auth_token>`
   - `JWT_SECRET` -> `<random_32_character_string>`
   - `ADMIN_USERNAME` -> `admin`
   - `ADMIN_EMAIL` -> `your-email@example.com`
   - `ADMIN_PASSWORD` -> `<your_strong_admin_password>`
4. Click **Deploy**.

### Step 3: Enable Vercel Blob Storage (1-Click)
1. In your Vercel project dashboard, go to the **Storage** tab.
2. Click **Create Database** -> **Blob** -> **Continue**.
3. Name the store `portfolio-blobs` and click **Create**.
4. Vercel will automatically connect `BLOB_READ_WRITE_TOKEN` to your project!

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local Environment
```bash
cp .env.example .env
```
*(Local development runs on a local SQLite file by default with zero cloud dependencies needed).*

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

- **Dynamic Resume Management**: Upload, view (`/api/resume/view`), and download (`/api/resume/download`) PDFs with one-click admin replacement via Vercel Blob CDN.
- **Dynamic Categories**: Relational many-to-many categories (`project_categories`) with instant client-side filtering.
- **Multi-Discipline Work**: Support for software projects, technical writing, dashboards, and research attachments.
- **Zero Native C++ Dependencies**: 100% pure JavaScript/WebAssembly client (`@libsql/client`), eliminating all GLIBC/native binary compilation issues permanently.
- **Production Hardened**: bcrypt salted hashing, rate limiting, secure cookies, helmet security headers, and zero client-exposed secrets.