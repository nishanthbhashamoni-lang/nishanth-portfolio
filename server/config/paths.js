import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurable persistent data root (e.g. Render Persistent Disk mount point or local data folder)
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'data');

export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
export const RESUME_DIR = path.join(UPLOADS_DIR, 'resume');
export const FILES_DIR = path.join(UPLOADS_DIR, 'files');
export const DB_PATH = path.join(DATA_DIR, 'portfolio.db');

// Ensure all required persistent storage directories exist
[DATA_DIR, UPLOADS_DIR, RESUME_DIR, FILES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});