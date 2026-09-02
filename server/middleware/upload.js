import multer from 'multer';

// Use memory storage so file buffers can be uploaded to Vercel Blob or saved locally
const storage = multer.memoryStorage();

const generalFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP, SVG, and PDF files are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter: generalFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
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
  storage,
  fileFilter: resumeFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});