import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

// GET /sla/policies
router.get('/sla/policies', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM sla_policies ORDER BY priority ASC');
    res.json({ success: true, message: 'SLA policies fetched', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /sla/policies
router.post('/sla/policies', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { name, description, priority, response_time_minutes, resolution_time_minutes, is_default } = req.body;
    if (!name || !priority) return res.status(400).json({ success: false, message: 'name and priority are required' });

    const id = uuidv4();
    await pool.query(
      `INSERT INTO sla_policies (id, name, description, priority, response_time_minutes, resolution_time_minutes, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description || null, priority, response_time_minutes || 60, resolution_time_minutes || 1440, is_default ? 1 : 0]
    );

    const [rows]: any = await pool.query('SELECT * FROM sla_policies WHERE id = ?', [id]);
    res.status(201).json({ success: true, message: 'SLA policy created', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /sla/policies/:id
router.patch('/sla/policies/:id', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, priority, response_time_minutes, resolution_time_minutes, is_default } = req.body;

    await pool.query(
      `UPDATE sla_policies SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        priority = COALESCE(?, priority),
        response_time_minutes = COALESCE(?, response_time_minutes),
        resolution_time_minutes = COALESCE(?, resolution_time_minutes),
        is_default = COALESCE(?, is_default)
       WHERE id = ?`,
      [name || null, description || null, priority || null, response_time_minutes || null, resolution_time_minutes || null, is_default !== undefined ? (is_default ? 1 : 0) : null, id]
    );

    const [rows]: any = await pool.query('SELECT * FROM sla_policies WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'SLA policy not found' });
    res.json({ success: true, message: 'SLA policy updated', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /sla/policies/:id
router.delete('/sla/policies/:id', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sla_policies WHERE id = ?', [id]);
    res.json({ success: true, message: 'SLA policy deleted', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
