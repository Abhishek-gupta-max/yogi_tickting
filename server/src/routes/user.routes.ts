import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// ─── GET /users ───────────────────────────────────────────────────────────────
router.get('/users', async (_req, res) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, email, name, role, status, avatar_url, phone, organization_id, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, message: 'Users fetched successfully', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /users/:id ───────────────────────────────────────────────────────────
router.get('/users/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, email, name, role, status, avatar_url, phone, organization_id, created_at, updated_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User fetched', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /users ──────────────────────────────────────────────────────────────
router.post('/users', requireRole('super_admin', 'company_admin', 'manager'), async (req, res) => {
  try {
    const { name, email, password = 'ChangeMe@123', role = 'agent', phone, organization_id } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'name and email are required' });
    }

    const [existing]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();

    await pool.query(
      `INSERT INTO users (id, email, password, name, role, phone, organization_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [id, email.toLowerCase().trim(), hashedPassword, name, role, phone || null, organization_id || null]
    );

    const [rows]: any = await pool.query(
      'SELECT id, email, name, role, status, avatar_url, phone, organization_id, created_at FROM users WHERE id = ?',
      [id]
    );

    res.status(201).json({ success: true, message: 'User created successfully', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /users/:id ─────────────────────────────────────────────────────────
router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, phone, status, avatar_url, organization_id } = req.body;

    // Non-admins can only update themselves
    if (req.user!.role === 'agent' && req.user!.sub !== id) {
      return res.status(403).json({ success: false, message: 'You can only update your own profile' });
    }

    await pool.query(
      `UPDATE users SET
        name           = COALESCE(?, name),
        role           = COALESCE(?, role),
        phone          = COALESCE(?, phone),
        status         = COALESCE(?, status),
        avatar_url     = COALESCE(?, avatar_url),
        organization_id= COALESCE(?, organization_id)
       WHERE id = ?`,
      [name || null, role || null, phone || null, status || null, avatar_url || null, organization_id || null, id]
    );

    const [rows]: any = await pool.query(
      'SELECT id, email, name, role, status, avatar_url, phone, organization_id, updated_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User updated', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /users/:id/password ────────────────────────────────────────────────
router.patch('/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.user!.sub !== id && req.user!.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const [rows]: any = await pool.query('SELECT password FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    // If not super admin, verify current password
    if (req.user!.role !== 'super_admin') {
      const valid = await bcrypt.compare(currentPassword, rows[0].password);
      if (!valid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ success: true, message: 'Password updated successfully', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /users/:id ────────────────────────────────────────────────────────
router.delete('/users/:id', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user!.sub === id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const [rows]: any = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    // Soft-delete: set status to inactive
    await pool.query("UPDATE users SET status = 'inactive' WHERE id = ?", [id]);

    res.json({ success: true, message: 'User deactivated successfully', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /departments ─────────────────────────────────────────────────────────
router.get('/departments', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM departments ORDER BY name ASC');
    res.json({ success: true, message: 'Departments fetched', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /departments ────────────────────────────────────────────────────────
router.post('/departments', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });

    const id = uuidv4();
    await pool.query('INSERT INTO departments (id, name, description) VALUES (?, ?, ?)', [id, name, description || null]);

    const [rows]: any = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);
    res.status(201).json({ success: true, message: 'Department created', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /departments/:id ───────────────────────────────────────────────────
router.patch('/departments/:id', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await pool.query('UPDATE departments SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?', [name || null, description || null, id]);
    const [rows]: any = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, message: 'Department updated', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /departments/:id ──────────────────────────────────────────────────
router.delete('/departments/:id', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM departments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Department deleted', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /organizations ───────────────────────────────────────────────────────
router.get('/organizations', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM organizations ORDER BY name ASC');
    res.json({ success: true, message: 'Organizations fetched', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /knowledge-base ──────────────────────────────────────────────────────
router.get('/knowledge-base', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM knowledge_articles ORDER BY created_at DESC');
    res.json({ success: true, message: 'Knowledge articles fetched', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
