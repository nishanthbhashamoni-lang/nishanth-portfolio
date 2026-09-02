import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const localDbPath = path.join(dataDir, 'portfolio.db').replace(/\\/g, '/');

export const dbClient = createClient({
  url: process.env.TURSO_DATABASE_URL || `file:${localDbPath}`,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

// Helper for single row query
export const dbGet = async (sql, params = []) => {
  const result = await dbClient.execute({ sql, args: params });
  if (!result.rows || result.rows.length === 0) return null;
  return result.rows[0];
};

// Helper for multiple rows query
export const dbAll = async (sql, params = []) => {
  const result = await dbClient.execute({ sql, args: params });
  return result.rows || [];
};

// Helper for write/mutation query
export const dbRun = async (sql, params = []) => {
  const result = await dbClient.execute({ sql, args: params });
  return {
    lastID: result.lastInsertRowid != null ? String(result.lastInsertRowid) : null,
    changes: result.rowsAffected || 0
  };
};

// Initialize schema tables
export const initTables = async () => {
  await dbClient.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      icon TEXT DEFAULT 'Layers',
      coverImage TEXT DEFAULT '',
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbClient.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tagline TEXT DEFAULT '',
      description TEXT NOT NULL,
      longDescription TEXT DEFAULT '',
      workType TEXT DEFAULT 'Project',
      technologies TEXT NOT NULL,
      category TEXT DEFAULT 'Software Project',
      status TEXT DEFAULT 'Completed',
      image TEXT DEFAULT '',
      additionalImages TEXT DEFAULT '[]',
      github TEXT DEFAULT '',
      demo TEXT DEFAULT '',
      externalUrl TEXT DEFAULT '',
      fileUrl TEXT DEFAULT '',
      date TEXT DEFAULT '',
      iconType TEXT DEFAULT 'code',
      sortOrder INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbClient.execute(`
    CREATE TABLE IF NOT EXISTS project_categories (
      project_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (project_id, category_id),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  await dbClient.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      mustChangePassword INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbClient.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export default dbClient;