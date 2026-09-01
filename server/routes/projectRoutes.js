import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dbAll, dbGet, dbRun } from '../config/db.js';
import { verifyAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

const router = express.Router();

// Helper to format project and fetch its assigned categories
const formatProjectWithCategories = async (row) => {
  if (!row) return null;

  let parsedTech = [];
  try {
    parsedTech = typeof row.technologies === 'string' 
      ? JSON.parse(row.technologies) 
      : (Array.isArray(row.technologies) ? row.technologies : []);
  } catch (e) {
    parsedTech = (row.technologies || '').split(',').map(t => t.trim()).filter(Boolean);
  }

  let parsedAdditionalImages = [];
  try {
    parsedAdditionalImages = typeof row.additionalImages === 'string'
      ? JSON.parse(row.additionalImages)
      : (Array.isArray(row.additionalImages) ? row.additionalImages : []);
  } catch (e) {
    parsedAdditionalImages = [];
  }

  // Fetch linked categories
  const categories = await dbAll(
    `SELECT c.id, c.name, c.slug, c.icon 
     FROM categories c
     JOIN project_categories pc ON c.id = pc.category_id
     WHERE pc.project_id = ?
     ORDER BY c.sortOrder ASC`,
    [row.id]
  );

  return {
    ...row,
    technologies: parsedTech,
    additionalImages: parsedAdditionalImages,
    featured: Boolean(row.featured),
    categories: categories || []
  };
};

// GET /api/projects (Public: Supports optional category filter ?category=slug)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let rows = [];

    if (category && category !== 'all') {
      rows = await dbAll(
        `SELECT DISTINCT p.* 
         FROM projects p
         JOIN project_categories pc ON p.id = pc.project_id
         JOIN categories c ON pc.category_id = c.id
         WHERE (c.slug = ? OR c.id = ?)
         ORDER BY p.sortOrder ASC, p.createdAt DESC`,
        [category, category]
      );
    } else {
      rows = await dbAll('SELECT * FROM projects ORDER BY sortOrder ASC, createdAt DESC');
    }

    const projects = await Promise.all(rows.map(formatProjectWithCategories));

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects.'
    });
  }
});

// GET /api/projects/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    const project = await formatProjectWithCategories(row);
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project.'
    });
  }
});

// POST /api/projects (Protected: Admin Only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const {
      id,
      title,
      tagline = '',
      description,
      longDescription = '',
      workType = 'Project',
      technologies = [],
      category = 'Software Project',
      categoryIds = [],
      status = 'Completed',
      image = '',
      additionalImages = [],
      github = '',
      demo = '',
      externalUrl = '',
      fileUrl = '',
      date = '',
      iconType = 'code',
      sortOrder = 0,
      featured = false
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Project title and description are required.'
      });
    }

    const projectId = id 
      ? id.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;

    const existing = await dbGet('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A work item with this ID already exists. Please choose a different title or slug.'
      });
    }

    const techJson = JSON.stringify(Array.isArray(technologies) ? technologies : []);
    const addImagesJson = JSON.stringify(Array.isArray(additionalImages) ? additionalImages : []);

    await dbRun(
      `INSERT INTO projects (
        id, title, tagline, description, longDescription, workType,
        technologies, category, status, image, additionalImages,
        github, demo, externalUrl, fileUrl, date, iconType,
        sortOrder, featured, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        projectId,
        title.trim(),
        tagline ? tagline.trim() : '',
        description.trim(),
        longDescription ? longDescription.trim() : '',
        workType ? workType.trim() : 'Project',
        techJson,
        category ? category.trim() : 'Software Project',
        status ? status.trim() : 'Completed',
        image ? image.trim() : '',
        addImagesJson,
        github ? github.trim() : '',
        demo ? demo.trim() : '',
        externalUrl ? externalUrl.trim() : '',
        fileUrl ? fileUrl.trim() : '',
        date ? date.trim() : '',
        iconType ? iconType.trim() : 'code',
        Number(sortOrder) || 0,
        featured ? 1 : 0
      ]
    );

    // Synchronize category links
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      for (const catId of categoryIds) {
        await dbRun(
          'INSERT OR IGNORE INTO project_categories (project_id, category_id) VALUES (?, ?)',
          [projectId, catId]
        );
      }
    }

    const created = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    const project = await formatProjectWithCategories(created);

    res.status(201).json({
      success: true,
      message: 'Work item created successfully.',
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create work item.'
    });
  }
});

// PUT /api/projects/:id (Protected: Admin Only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const projectId = req.params.id;
    const existing = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Work item not found.'
      });
    }

    const {
      title = existing.title,
      tagline = existing.tagline,
      description = existing.description,
      longDescription = existing.longDescription,
      workType = existing.workType,
      technologies = existing.technologies,
      category = existing.category,
      categoryIds,
      status = existing.status,
      image = existing.image,
      additionalImages = existing.additionalImages,
      github = existing.github,
      demo = existing.demo,
      externalUrl = existing.externalUrl,
      fileUrl = existing.fileUrl,
      date = existing.date,
      iconType = existing.iconType,
      sortOrder = existing.sortOrder,
      featured = existing.featured
    } = req.body;

    const techJson = typeof technologies === 'string'
      ? (technologies.startsWith('[') ? technologies : JSON.stringify([technologies]))
      : JSON.stringify(Array.isArray(technologies) ? technologies : []);

    const addImagesJson = typeof additionalImages === 'string'
      ? (additionalImages.startsWith('[') ? additionalImages : JSON.stringify([additionalImages]))
      : JSON.stringify(Array.isArray(additionalImages) ? additionalImages : []);

    await dbRun(
      `UPDATE projects SET 
        title = ?,
        tagline = ?,
        description = ?,
        longDescription = ?,
        workType = ?,
        technologies = ?,
        category = ?,
        status = ?,
        image = ?,
        additionalImages = ?,
        github = ?,
        demo = ?,
        externalUrl = ?,
        fileUrl = ?,
        date = ?,
        iconType = ?,
        sortOrder = ?,
        featured = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        title.trim(),
        tagline ? tagline.trim() : '',
        description.trim(),
        longDescription ? longDescription.trim() : '',
        workType ? workType.trim() : 'Project',
        techJson,
        category ? category.trim() : 'Software Project',
        status ? status.trim() : 'Completed',
        image ? image.trim() : '',
        addImagesJson,
        github ? github.trim() : '',
        demo ? demo.trim() : '',
        externalUrl ? externalUrl.trim() : '',
        fileUrl ? fileUrl.trim() : '',
        date ? date.trim() : '',
        iconType ? iconType.trim() : 'code',
        Number(sortOrder) || 0,
        featured ? 1 : 0,
        projectId
      ]
    );

    // Synchronize category links if categoryIds was passed
    if (Array.isArray(categoryIds)) {
      await dbRun('DELETE FROM project_categories WHERE project_id = ?', [projectId]);
      for (const catId of categoryIds) {
        await dbRun(
          'INSERT OR IGNORE INTO project_categories (project_id, category_id) VALUES (?, ?)',
          [projectId, catId]
        );
      }
    }

    const updated = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    const project = await formatProjectWithCategories(updated);

    res.json({
      success: true,
      message: 'Work item updated successfully.',
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update work item.'
    });
  }
});

// DELETE /api/projects/:id (Protected: Admin Only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const projectId = req.params.id;
    const existing = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Work item not found.'
      });
    }

    // Clean up uploaded files if present in /uploads/
    const cleanupPath = (fileUrl) => {
      if (fileUrl && fileUrl.startsWith('/uploads/')) {
        const fullPath = path.join(uploadsDir, fileUrl.replace(/^\/uploads\//, ''));
        if (fs.existsSync(fullPath)) {
          try { fs.unlinkSync(fullPath); } catch (e) {}
        }
      }
    };

    cleanupPath(existing.image);
    cleanupPath(existing.fileUrl);

    // Delete associations and project record
    await dbRun('DELETE FROM project_categories WHERE project_id = ?', [projectId]);
    await dbRun('DELETE FROM projects WHERE id = ?', [projectId]);

    res.json({
      success: true,
      message: 'Work item deleted successfully.',
      deletedId: projectId
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete work item.'
    });
  }
});

export default router;