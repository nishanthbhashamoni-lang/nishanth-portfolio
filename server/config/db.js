import sqlite3 from 'sqlite3';
import { DATA_DIR, DB_PATH, UPLOADS_DIR, RESUME_DIR, FILES_DIR } from './paths.js';

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database at:', DB_PATH, err.message);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
  }
});

// Initialize database tables
db.serialize(() => {
  // 1. Categories Table
  db.run(`
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

  // 2. Projects / Work Items Table
  db.run(`
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

  // 3. Project Categories Many-to-Many Relationship Table
  db.run(`
    CREATE TABLE IF NOT EXISTS project_categories (
      project_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (project_id, category_id),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // 4. Admin Users Table
  db.run(`
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

  // Column migration for mustChangePassword if table existed earlier
  db.run('ALTER TABLE admin_users ADD COLUMN mustChangePassword INTEGER DEFAULT 1', () => {});

  // 5. Site Settings / Resume Metadata Table
  db.run(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Promisified helper methods
export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export default db;