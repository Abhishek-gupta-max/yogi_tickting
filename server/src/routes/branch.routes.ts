import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

// GET /branches
router.get('/branches', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM branches ORDER BY name ASC');
    res.json({ success: true, message: 'Branches fetched', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /branches
router.post('/branches', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { name, code, city, country } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });

    const id = uuidv4();
    await pool.query(
      'INSERT INTO branches (id, name, code, city, country) VALUES (?, ?, ?, ?, ?)',
      [id, name, code || null, city || null, country || null]
    );

    const [rows]: any = await pool.query('SELECT * FROM branches WHERE id = ?', [id]);
    res.status(201).json({ success: true, message: 'Branch created', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /branches/:id
router.patch('/branches/:id', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, city, country, status } = req.body;

    await pool.query(
      `UPDATE branches SET
        name = COALESCE(?, name),
        code = COALESCE(?, code),
        city = COALESCE(?, city),
        country = COALESCE(?, country),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [name || null, code || null, city || null, country || null, status || null, id]
    );

    const [rows]: any = await pool.query('SELECT * FROM branches WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Branch not found' });
    res.json({ success: true, message: 'Branch updated', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /branches/:id
router.delete('/branches/:id', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM branches WHERE id = ?', [id]);
    res.json({ success: true, message: 'Branch deleted', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
