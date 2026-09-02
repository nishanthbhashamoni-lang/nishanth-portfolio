import express from 'express';
import path from 'path';
import fs from 'fs';
import { upload } from '../middleware/upload.js';
import { verifyAdmin } from '../middleware/auth.js';
import { UPLOADS_DIR, FILES_DIR } from '../config/paths.js';

const router = express.Router();

// POST /api/upload (Protected: Admin Only)
router.post('/', verifyAdmin, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided.'
      });
    }

    const isPdf = req.file.mimetype === 'application/pdf';
    const publicUrl = isPdf ? `/uploads/files/${req.file.filename}` : `/uploads/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      url: publicUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

// DELETE /api/upload (Protected: Admin Only)
router.delete('/', verifyAdmin, (req, res) => {
  try {
    const { url, filename } = req.body;
    const targetFile = filename || (url ? path.basename(url) : null);

    if (!targetFile) {
      return res.status(400).json({
        success: false,
        message: 'Filename or URL required to delete.'
      });
    }

    const sanitizedFilename = path.basename(targetFile);
    const regularPath = path.join(UPLOADS_DIR, sanitizedFilename);
    const filesPath = path.join(FILES_DIR, sanitizedFilename);

    let deleted = false;
    if (fs.existsSync(regularPath)) {
      fs.unlinkSync(regularPath);
      deleted = true;
    } else if (fs.existsSync(filesPath)) {
      fs.unlinkSync(filesPath);
      deleted = true;
    }

    if (deleted) {
      return res.json({
        success: true,
        message: 'File deleted from storage.'
      });
    }

    res.json({
      success: true,
      message: 'File was already removed or does not exist.'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file from storage.'
    });
  }
});

export default router;