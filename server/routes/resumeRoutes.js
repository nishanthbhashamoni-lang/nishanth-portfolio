import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dbGet, dbRun } from '../config/db.js';
import { verifyAdmin } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';
import { uploadFileBlob, deleteFileBlob } from '../config/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper to get active resume metadata
const getResumeMetadata = async () => {
  const row = await dbGet('SELECT value, updatedAt FROM site_settings WHERE key = ?', ['resume_data']);
  if (!row || !row.value) return null;
  try {
    const data = JSON.parse(row.value);
    const resolvedUrl = data.url || data.publicUrl || (data.filename ? `/uploads/resume/${data.filename}` : null);
    if (!resolvedUrl) return null;
    return {
      ...data,
      url: resolvedUrl,
      downloadUrl: data.downloadUrl || resolvedUrl,
      updatedAt: row.updatedAt
    };
  } catch (e) {
    return null;
  }
};

// GET /api/resume/status (Public)
router.get('/status', async (req, res) => {
  try {
    const metadata = await getResumeMetadata();
    if (!metadata || !metadata.url) {
      return res.json({
        success: true,
        available: false,
        message: 'No resume uploaded yet.'
      });
    }

    res.json({
      success: true,
      available: true,
      url: '/api/resume/view',
      downloadUrl: '/api/resume/download',
      filename: metadata.filename,
      originalName: metadata.originalName,
      size: metadata.size,
      updatedAt: metadata.updatedAt
    });
  } catch (error) {
    console.error('Error fetching resume status:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resume status.' });
  }
});

// GET /api/resume/view (Public: Opens PDF inline in browser)
router.get('/view', async (req, res) => {
  try {
    const metadata = await getResumeMetadata();
    if (!metadata || !metadata.url) {
      return res.status(404).send('Resume file is currently unavailable or has not been uploaded yet.');
    }

    if (metadata.url.startsWith('http')) {
      return res.redirect(metadata.url);
    }

    // Local file fallback
    const localPath = metadata.filePath || path.join(__dirname, '..', 'data', 'uploads', 'resume', metadata.filename);
    if (fs.existsSync(localPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(metadata.originalName || 'Nishanth_Bhashamoni_Resume.pdf')}"`);
      return fs.createReadStream(localPath).pipe(res);
    }

    return res.redirect(metadata.url);
  } catch (error) {
    console.error('Error viewing resume:', error);
    res.status(500).send('Error viewing resume file.');
  }
});

// GET /api/resume/download (Public: Forces direct download of PDF)
router.get('/download', async (req, res) => {
  try {
    const metadata = await getResumeMetadata();
    if (!metadata || !metadata.url) {
      return res.status(404).send('Resume file is currently unavailable or has not been uploaded yet.');
    }

    if (metadata.url.startsWith('http')) {
      return res.redirect(metadata.downloadUrl || metadata.url);
    }

    // Local file fallback
    const localPath = metadata.filePath || path.join(__dirname, '..', 'data', 'uploads', 'resume', metadata.filename);
    if (fs.existsSync(localPath)) {
      const downloadFilename = metadata.originalName || 'Nishanth_Bhashamoni_Resume.pdf';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFilename)}"`);
      return fs.createReadStream(localPath).pipe(res);
    }

    return res.redirect(metadata.url);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).send('Error downloading resume file.');
  }
});

// POST /api/resume (Protected: Admin Only)
router.post('/', verifyAdmin, (req, res) => {
  uploadResume.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload resume PDF.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume PDF file provided.'
      });
    }

    try {
      // 1. Delete previous resume blob/file if exists
      const existing = await getResumeMetadata();
      if (existing && existing.url) {
        await deleteFileBlob(existing.url);
      }

      // 2. Upload to Vercel Blob / Storage
      const uploadResult = await uploadFileBlob({
        folder: 'resume',
        filename: req.file.originalname,
        buffer: req.file.buffer,
        contentType: req.file.mimetype || 'application/pdf'
      });

      const newMetadata = {
        filename: req.file.originalname,
        originalName: req.file.originalname,
        url: uploadResult.url,
        downloadUrl: uploadResult.downloadUrl,
        filePath: uploadResult.pathname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString()
      };

      await dbRun(
        `INSERT INTO site_settings (key, value, updatedAt)
         VALUES ('resume_data', ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET
           value = excluded.value,
           updatedAt = CURRENT_TIMESTAMP`,
        [JSON.stringify(newMetadata)]
      );

      res.status(201).json({
        success: true,
        message: 'Resume uploaded and activated successfully.',
        data: {
          available: true,
          url: '/api/resume/view',
          downloadUrl: '/api/resume/download',
          filename: newMetadata.filename,
          originalName: newMetadata.originalName,
          size: newMetadata.size,
          updatedAt: newMetadata.uploadedAt
        }
      });
    } catch (dbError) {
      console.error('Database error saving resume settings:', dbError);
      res.status(500).json({
        success: false,
        message: 'Failed to update resume settings in database.'
      });
    }
  });
});

// DELETE /api/resume (Protected: Admin Only)
router.delete('/', verifyAdmin, async (req, res) => {
  try {
    const existing = await getResumeMetadata();
    if (existing && existing.url) {
      await deleteFileBlob(existing.url);
    }

    await dbRun('DELETE FROM site_settings WHERE key = ?', ['resume_data']);

    res.json({
      success: true,
      message: 'Resume deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume.'
    });
  }
});

export default router;