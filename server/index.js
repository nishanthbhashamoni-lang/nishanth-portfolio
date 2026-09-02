import app, { ensureDbReady } from './app.js';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const distPath = path.join(__dirname, '..', 'dist');

// Serve built frontend if dist exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 handler for unknown routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'API endpoint not found.'
    });
  }
  res.status(404).send('Not Found');
});

ensureDbReady().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`🚀 Portfolio Server running on http://${HOST}:${PORT}`);
    console.log(`🏥 Health Check: http://${HOST}:${PORT}/api/health`);
    console.log(`====================================================`);
  });
});

export default app;