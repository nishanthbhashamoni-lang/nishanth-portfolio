import express from 'express';
import { upload } from '../middleware/upload.js';
import { verifyAdmin } from '../middleware/auth.js';
import { uploadFileBlob, deleteFileBlob } from '../config/storage.js';

const router = express.Router();

// POST /api/upload (Protected: Admin Only)
router.post('/', verifyAdmin, (req, res) => {
  upload.single('file')(req, res, async (err) => {
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

    try {
      const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
      const folder = isPdf ? 'files' : 'uploads';

      const uploadResult = await uploadFileBlob({
        folder,
        filename: req.file.originalname,
        buffer: req.file.buffer,
        contentType: req.file.mimetype
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully.',
        url: uploadResult.url,
        downloadUrl: uploadResult.downloadUrl,
        filename: req.file.originalname,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (uploadErr) {
      console.error('Error uploading file:', uploadErr);
      res.status(500).json({
        success: false,
        message: 'Failed to process file upload.'
      });
    }
  });
});

// DELETE /api/upload (Protected: Admin Only)
router.delete('/', verifyAdmin, async (req, res) => {
  try {
    const { url, filename } = req.body;
    const target = url || filename;

    if (!target) {
      return res.status(400).json({
        success: false,
        message: 'Filename or URL required to delete.'
      });
    }

    const deleted = await deleteFileBlob(target);

    res.json({
      success: true,
      message: deleted ? 'File deleted from storage.' : 'File was already removed or does not exist.'
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