import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');
const resumeDir = path.join(uploadsDir, 'resume');
const filesDir = path.join(uploadsDir, 'files');

[uploadsDir, resumeDir, filesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. Storage for Images & General Project Attachments
const generalStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, filesDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `file-${sanitizedBase}-${uniqueSuffix}${ext}`);
  }
});

// File filter for general uploads (images + PDFs)
const generalFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP, SVG, and PDF files are allowed.'), false);
  }
};

export const upload = multer({
  storage: generalStorage,
  fileFilter: generalFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// 2. Storage for Resume PDF
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumeDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}`;
    cb(null, `nishanth-resume-${uniqueSuffix}.pdf`);
  }
});

const resumeFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid resume file. Only PDF files are accepted.'), false);
  }
};

export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});