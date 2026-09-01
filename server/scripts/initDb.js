import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db, { dbGet, dbRun, dbAll } from '../config/db.js';

export async function initDatabase() {
  // 1. Ensure Admin User exists
  const existingAdmin = await dbGet('SELECT * FROM admin_users LIMIT 1');
  if (!existingAdmin) {
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.local';
    const defaultPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('hex');

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    await dbRun(
      `INSERT INTO admin_users (id, username, email, passwordHash, role, mustChangePassword, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'admin', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      ['admin-master-1', defaultUsername, defaultEmail, passwordHash]
    );

    console.log('✓ Initial Admin User created in database.');
    console.log('  Security notice: Update your password via the admin portal before production deployment.');
  }

  // 2. Ensure initial categories exist
  const existingCategories = await dbAll('SELECT * FROM categories');
  if (existingCategories.length === 0) {
    const initialCategories = [
      {
        id: 'data-analytics',
        name: 'Data Analytics',
        slug: 'data-analytics',
        description: 'Exploratory data analysis, statistical modeling, forecasting, and data pipelines.',
        icon: 'BarChart3',
        sortOrder: 1,
        isActive: 1
      },
      {
        id: 'data-visualization',
        name: 'Data Visualization & BI',
        slug: 'data-visualization',
        description: 'Interactive Tableau dashboards, business intelligence, and telemetry insights.',
        icon: 'LineChart',
        sortOrder: 2,
        isActive: 1
      },
      {
        id: 'ai-ml',
        name: 'AI & Machine Learning',
        slug: 'ai-ml',
        description: 'Predictive algorithms, LLM workflows, foundation models, and AI solutions.',
        icon: 'Sparkles',
        sortOrder: 3,
        isActive: 1
      },
      {
        id: 'content-writing',
        name: 'Content Writing',
        slug: 'content-writing',
        description: 'Technical articles, research storytelling, educational scripts, and blog creation.',
        icon: 'Feather',
        sortOrder: 4,
        isActive: 1
      }
    ];

    for (const c of initialCategories) {
      await dbRun(
        `INSERT INTO categories (id, name, slug, description, icon, sortOrder, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [c.id, c.name, c.slug, c.description, c.icon, c.sortOrder, c.isActive]
      );
    }
  }

  // 3. Ensure initial valid projects exist
  const existingProjects = await dbAll('SELECT * FROM projects');
  if (existingProjects.length === 0) {
    const initialProjects = [
      {
        id: 'retail-demand-forecasting',
        title: 'Retail Demand Forecasting',
        tagline: 'Hackathon Analytics & Auto-Reorder Engine',
        description: 'Retail analytics application that helps businesses forecast product demand and make better inventory and auto-reorder decisions. Built during TakeOver\'26 Hackathon.',
        longDescription: 'Developed during an intensive 24-hour sprint to solve supply chain inefficiencies. Built analytical demand forecast models paired with an automated inventory threshold trigger system.',
        workType: 'Project',
        technologies: JSON.stringify(['Python', 'Data Analytics', 'Forecasting', 'Flask']),
        category: 'Data Analytics',
        status: 'Completed',
        image: '',
        github: 'https://github.com',
        demo: '',
        externalUrl: '',
        fileUrl: '',
        date: "TakeOver'26",
        iconType: 'trending-up',
        sortOrder: 1,
        featured: 1,
        categories: ['data-analytics', 'ai-ml']
      },
      {
        id: 'daikibo-telemetry',
        title: 'Daikibo Telemetry Dashboard',
        tagline: 'Industrial IoT Downtime Analytics',
        description: 'Interactive Tableau dashboard analyzing factory downtime and device-level telemetry data to identify operational patterns and potential improvement areas.',
        longDescription: 'Aggregated device sensor logs and factory telemetry metrics to construct interactive BI views, helping plant operators diagnose downtime causes and optimize machine reliability.',
        workType: 'Dashboard',
        technologies: JSON.stringify(['Tableau', 'Data Visualization', 'Data Analysis']),
        category: 'Data Visualization & BI',
        status: 'Completed',
        image: '',
        github: 'https://github.com',
        demo: '',
        externalUrl: '',
        fileUrl: '',
        date: '2026',
        iconType: 'gauge',
        sortOrder: 2,
        featured: 1,
        categories: ['data-visualization', 'data-analytics']
      }
    ];

    for (const p of initialProjects) {
      await dbRun(
        `INSERT INTO projects (
          id, title, tagline, description, longDescription, workType,
          technologies, category, status, image, github, demo,
          externalUrl, fileUrl, date, iconType, sortOrder, featured,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          p.id, p.title, p.tagline, p.description, p.longDescription, p.workType,
          p.technologies, p.category, p.status, p.image, p.github, p.demo,
          p.externalUrl, p.fileUrl, p.date, p.iconType, p.sortOrder, p.featured
        ]
      );

      for (const catId of p.categories) {
        await dbRun(
          'INSERT OR IGNORE INTO project_categories (project_id, category_id) VALUES (?, ?)',
          [p.id, catId]
        );
      }
    }
  }

  // 4. Ensure project_categories mapping is populated for existing projects
  const links = await dbAll('SELECT * FROM project_categories');
  if (links.length === 0) {
    const p1 = await dbGet('SELECT id FROM projects WHERE id = "retail-demand-forecasting"');
    if (p1) {
      await dbRun('INSERT OR IGNORE INTO project_categories (project_id, category_id) VALUES (?, ?)', [p1.id, 'data-analytics']);
      await dbRun('INSERT OR IGNORE INTO project_categories (project_id, category_id) VALUES (?, ?)', [p1.id, 'ai-ml']);
    }
    const p2 = await dbGet('SELECT id FROM projects WHERE id = "daikibo-telemetry"');
    if (p2) {
      await dbRun('INSERT OR IGNORE INTO project_categories (project_id, category_id) VALUES (?, ?)', [p2.id, 'data-visualization']);
      await dbRun('INSERT OR IGNORE INTO project_categories (project_id, category_id) VALUES (?, ?)', [p2.id, 'data-analytics']);
    }
  }
}

// Run directly if invoked as script
if (process.argv[1]?.endsWith('initDb.js')) {
  initDatabase().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('Database initialization error:', err);
    process.exit(1);
  });
}