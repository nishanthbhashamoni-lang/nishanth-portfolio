# Nishanth Bhashamoni — Personal Portfolio

A sleek, responsive, and modern personal portfolio built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Vercel 1-Click Static Deployment ($0/mo)

This website is a 100% static React single-page application ready to deploy on **Vercel** with zero configuration, zero servers, and zero environment variables required.

### Deployment Steps:
1. Push your code to your GitHub repository.
2. Go to **[Vercel Dashboard](https://vercel.com/new)** and click **Import** on `nishanth-portfolio`.
3. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**.

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Customizing Content

All portfolio information is centralized in [`src/data/portfolioData.js`](src/data/portfolioData.js):
- **Personal Info & Socials**: Name, bio, email, GitHub, LinkedIn.
- **Projects**: Add, remove, or edit featured projects with tags, github links, and demos.
- **Category Filtering**: Categories and projects update dynamically on the client.
- **Skills & Experience**: Update skills, achievements, and career history.
- **Resume**: Place your updated PDF in [`public/resume.pdf`](public/resume.pdf).