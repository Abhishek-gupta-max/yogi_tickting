import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

// ─── GET /teams ───────────────────────────────────────────────────────────────
router.get('/teams', async (_req, res) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT t.*, d.name as department_name,
        (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) as member_count
       FROM teams t
       LEFT JOIN departments d ON t.department_id = d.id
       ORDER BY t.name ASC`
    );
    res.json({ success: true, message: 'Teams fetched', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /teams/:id ───────────────────────────────────────────────────────────
router.get('/teams/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM teams WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Team not found' });

    const [members]: any = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.avatar_url, tm.joined_at
       FROM team_members tm JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, message: 'Team fetched', data: { ...rows[0], members } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /teams ──────────────────────────────────────────────────────────────
router.post('/teams', requireRole('super_admin', 'company_admin', 'manager'), async (req, res) => {
  try {
    const { name, description, department_id, lead_id } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });

    const id = uuidv4();
    await pool.query(
      'INSERT INTO teams (id, name, description, department_id, lead_id) VALUES (?, ?, ?, ?, ?)',
      [id, name, description || null, department_id || null, lead_id || null]
    );

    const [rows]: any = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
    res.status(201).json({ success: true, message: 'Team created', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /teams/:id ─────────────────────────────────────────────────────────
router.patch('/teams/:id', requireRole('super_admin', 'company_admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, department_id, lead_id } = req.body;

    await pool.query(
      `UPDATE teams SET
        name          = COALESCE(?, name),
        description   = COALESCE(?, description),
        department_id = COALESCE(?, department_id),
        lead_id       = COALESCE(?, lead_id)
       WHERE id = ?`,
      [name || null, description || null, department_id || null, lead_id || null, id]
    );

    const [rows]: any = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, message: 'Team updated', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /teams/:id ────────────────────────────────────────────────────────
router.delete('/teams/:id', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM team_members WHERE team_id = ?', [id]);
    await pool.query('DELETE FROM teams WHERE id = ?', [id]);
    res.json({ success: true, message: 'Team deleted', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /teams/:id/members ──────────────────────────────────────────────────
router.post('/teams/:id/members', requireRole('super_admin', 'company_admin', 'manager'), async (req, res) => {
  try {
    const { id: team_id } = req.params;
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ success: false, message: 'user_id is required' });

    const [existing]: any = await pool.query('SELECT id FROM team_members WHERE team_id = ? AND user_id = ?', [team_id, user_id]);
    if (existing.length > 0) return res.status(409).json({ success: false, message: 'User is already a team member' });

    const id = uuidv4();
    await pool.query('INSERT INTO team_members (id, team_id, user_id) VALUES (?, ?, ?)', [id, team_id, user_id]);
    res.status(201).json({ success: true, message: 'Member added to team', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /teams/:id/members/:userId ────────────────────────────────────────
router.delete('/teams/:id/members/:userId', requireRole('super_admin', 'company_admin', 'manager'), async (req, res) => {
  try {
    const { id: team_id, userId: user_id } = req.params;
    await pool.query('DELETE FROM team_members WHERE team_id = ? AND user_id = ?', [team_id, user_id]);
    res.json({ success: true, message: 'Member removed from team', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
