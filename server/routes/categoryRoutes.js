import express from 'express';
import { dbAll, dbGet, dbRun } from '../config/db.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories (Public: Returns categories with project counts)
router.get('/', async (req, res) => {
  try {
    const includeInactive = req.query.all === 'true';
    let sql = `
      SELECT 
        c.*, 
        COUNT(pc.project_id) as projectCount
      FROM categories c
      LEFT JOIN project_categories pc ON c.id = pc.category_id
    `;

    if (!includeInactive) {
      sql += ' WHERE c.isActive = 1 ';
    }

    sql += ' GROUP BY c.id ORDER BY c.sortOrder ASC, c.name ASC';

    const rows = await dbAll(sql);
    const categories = rows.map(r => ({
      ...r,
      isActive: Boolean(r.isActive),
      projectCount: Number(r.projectCount) || 0
    }));

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

// GET /api/categories/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM categories WHERE id = ? OR slug = ?', [req.params.id, req.params.id]);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({
      success: true,
      data: {
        ...row,
        isActive: Boolean(row.isActive)
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category.' });
  }
});

// POST /api/categories (Protected: Admin Only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      description = '',
      icon = 'Layers',
      coverImage = '',
      sortOrder = 0,
      isActive = true
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const categorySlug = (slug && slug.trim())
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');

    const categoryId = categorySlug;

    // Check if ID or slug already exists
    const existing = await dbGet('SELECT id FROM categories WHERE id = ? OR slug = ?', [categoryId, categorySlug]);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists.'
      });
    }

    await dbRun(
      `INSERT INTO categories (id, name, slug, description, icon, coverImage, sortOrder, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        categoryId,
        name.trim(),
        categorySlug,
        description.trim(),
        icon.trim() || 'Layers',
        coverImage.trim(),
        Number(sortOrder) || 0,
        isActive ? 1 : 0
      ]
    );

    const created = await dbGet('SELECT * FROM categories WHERE id = ?', [categoryId]);

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: {
        ...created,
        isActive: Boolean(created.isActive),
        projectCount: 0
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
});

// PUT /api/categories/:id (Protected: Admin Only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const existing = await dbGet('SELECT * FROM categories WHERE id = ?', [categoryId]);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const {
      name = existing.name,
      slug = existing.slug,
      description = existing.description,
      icon = existing.icon,
      coverImage = existing.coverImage,
      sortOrder = existing.sortOrder,
      isActive = existing.isActive
    } = req.body;

    const categorySlug = (slug && slug.trim())
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : existing.slug;

    // Check if new slug conflicts with another category
    if (categorySlug !== existing.slug) {
      const conflict = await dbGet('SELECT id FROM categories WHERE slug = ? AND id != ?', [categorySlug, categoryId]);
      if (conflict) {
        return res.status(400).json({ success: false, message: 'Another category is already using this slug.' });
      }
    }

    await dbRun(
      `UPDATE categories SET 
        name = ?,
        slug = ?,
        description = ?,
        icon = ?,
        coverImage = ?,
        sortOrder = ?,
        isActive = ?,
        updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name.trim(),
        categorySlug,
        description ? description.trim() : '',
        icon ? icon.trim() : 'Layers',
        coverImage ? coverImage.trim() : '',
        Number(sortOrder) || 0,
        isActive ? 1 : 0,
        categoryId
      ]
    );

    const updated = await dbGet('SELECT * FROM categories WHERE id = ?', [categoryId]);

    res.json({
      success: true,
      message: 'Category updated successfully.',
      data: {
        ...updated,
        isActive: Boolean(updated.isActive)
      }
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
});

// DELETE /api/categories/:id (Protected: Admin Only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const existing = await dbGet('SELECT * FROM categories WHERE id = ?', [categoryId]);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Delete associations first
    await dbRun('DELETE FROM project_categories WHERE category_id = ?', [categoryId]);
    await dbRun('DELETE FROM categories WHERE id = ?', [categoryId]);

    res.json({
      success: true,
      message: 'Category deleted successfully.',
      deletedId: categoryId
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
});

export default router;