import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All ticket routes require authentication
router.use(authenticate);

// ─── GET /tickets ─────────────────────────────────────────────────────────────
router.get('/tickets', async (req, res) => {
  try {
    const { status, priority, assignee_id, search, page = '1', pageSize = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (status)      { where += ' AND t.status = ?';       params.push(status); }
    if (priority)    { where += ' AND t.priority = ?';     params.push(priority); }
    if (assignee_id) { where += ' AND t.assignee_id = ?';  params.push(assignee_id); }
    if (search) {
      where += ' AND (t.title LIKE ? OR t.ticket_number LIKE ? OR t.customer_email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countRows]: any = await pool.query(`SELECT COUNT(*) as total FROM tickets t ${where}`, params);
    const total = countRows[0].total;

    const [rows]: any = await pool.query(
      `SELECT t.*, u.name as assignee_name, u.avatar_url as assignee_avatar
       FROM tickets t
       LEFT JOIN users u ON t.assignee_id = u.id
       ${where}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    res.json({
      success: true,
      message: 'Tickets retrieved successfully',
      data: rows,
      meta: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / parseInt(pageSize)),
        hasNextPage: offset + parseInt(pageSize) < total,
        hasPreviousPage: parseInt(page) > 1,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /tickets/:id ─────────────────────────────────────────────────────────
router.get('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query(
      `SELECT t.*, u.name as assignee_name, u.avatar_url as assignee_avatar, u.email as assignee_email
       FROM tickets t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.id = ? OR t.ticket_number = ?`,
      [id, id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, message: 'Ticket details retrieved', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /tickets ────────────────────────────────────────────────────────────
router.post('/tickets', async (req, res) => {
  try {
    const {
      title, description,
      priority = 'medium', category = 'General',
      customer_name, customer_email,
      assignee_id, department_id, organization_id,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'title and description are required' });
    }

    const id = uuidv4();
    const ticket_number = `TKT-${String(Date.now()).slice(-6)}`;

    await pool.query(
      `INSERT INTO tickets (id, ticket_number, title, description, priority, category,
        customer_name, customer_email, assignee_id, department_id, organization_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')`,
      [id, ticket_number, title, description, priority, category,
        customer_name || 'Guest User', customer_email || null,
        assignee_id || null, department_id || null, organization_id || null]
    );

    // Log creation to audit
    await logAudit(pool, 'ticket.created', 'tickets', id, req.user!.sub, null, { ticket_number, title });

    const [rows]: any = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
    res.status(201).json({ success: true, message: 'Ticket created successfully', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /tickets/:id ───────────────────────────────────────────────────────
router.patch('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, title, description, assignee_id, department_id, category } = req.body;

    const [before]: any = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
    if (before.length === 0) return res.status(404).json({ success: false, message: 'Ticket not found' });

    await pool.query(
      `UPDATE tickets SET
        status        = COALESCE(?, status),
        priority      = COALESCE(?, priority),
        title         = COALESCE(?, title),
        description   = COALESCE(?, description),
        assignee_id   = COALESCE(?, assignee_id),
        department_id = COALESCE(?, department_id),
        category      = COALESCE(?, category)
       WHERE id = ?`,
      [status || null, priority || null, title || null, description || null,
        assignee_id || null, department_id || null, category || null, id]
    );

    const [rows]: any = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
    await logAudit(pool, 'ticket.updated', 'tickets', id, req.user!.sub, before[0], req.body);

    res.json({ success: true, message: 'Ticket updated', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /tickets/:id ──────────────────────────────────────────────────────
router.delete('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query('SELECT id, ticket_number FROM tickets WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Ticket not found' });

    await pool.query('DELETE FROM ticket_comments WHERE ticket_id = ?', [id]);
    await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
    await logAudit(pool, 'ticket.deleted', 'tickets', id, req.user!.sub, rows[0], null);

    res.json({ success: true, message: 'Ticket deleted', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /tickets/:id/comments ────────────────────────────────────────────────
router.get('/tickets/:id/comments', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM ticket_comments WHERE ticket_id = ? ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json({ success: true, message: 'Comments retrieved', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /tickets/:id/comments ───────────────────────────────────────────────
router.post('/tickets/:id/comments', async (req, res) => {
  try {
    const { id: ticket_id } = req.params;
    const { content, is_internal = false } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const [ticket]: any = await pool.query('SELECT id FROM tickets WHERE id = ?', [ticket_id]);
    if (ticket.length === 0) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const commentId = uuidv4();
    const userId = req.user!.sub;

    const [userRows]: any = await pool.query('SELECT name FROM users WHERE id = ?', [userId]);
    const userName = userRows[0]?.name || req.user!.email;

    await pool.query(
      'INSERT INTO ticket_comments (id, ticket_id, user_id, user_name, content, is_internal) VALUES (?, ?, ?, ?, ?, ?)',
      [commentId, ticket_id, userId, userName, content.trim(), is_internal ? 1 : 0]
    );

    const [rows]: any = await pool.query('SELECT * FROM ticket_comments WHERE id = ?', [commentId]);
    res.status(201).json({ success: true, message: 'Comment added', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /tickets/:id/comments/:commentId ───────────────────────────────────
router.patch('/tickets/:id/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const [rows]: any = await pool.query('SELECT * FROM ticket_comments WHERE id = ?', [commentId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Comment not found' });

    // Only the author or admin can edit
    if (rows[0].user_id !== req.user!.sub && req.user!.role !== 'super_admin' && req.user!.role !== 'company_admin') {
      return res.status(403).json({ success: false, message: 'You can only edit your own comments' });
    }

    await pool.query('UPDATE ticket_comments SET content = ? WHERE id = ?', [content, commentId]);
    const [updated]: any = await pool.query('SELECT * FROM ticket_comments WHERE id = ?', [commentId]);
    res.json({ success: true, message: 'Comment updated', data: updated[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /tickets/:id/comments/:commentId ──────────────────────────────────
router.delete('/tickets/:id/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const [rows]: any = await pool.query('SELECT user_id FROM ticket_comments WHERE id = ?', [commentId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (rows[0].user_id !== req.user!.sub && req.user!.role !== 'super_admin' && req.user!.role !== 'company_admin') {
      return res.status(403).json({ success: false, message: 'You can only delete your own comments' });
    }

    await pool.query('DELETE FROM ticket_comments WHERE id = ?', [commentId]);
    res.json({ success: true, message: 'Comment deleted', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /tickets/:id/timeline ────────────────────────────────────────────────
router.get('/tickets/:id/timeline', async (req, res) => {
  try {
    const [comments]: any = await pool.query(
      'SELECT id, user_name, content, is_internal, created_at, "comment" as type FROM ticket_comments WHERE ticket_id = ? ORDER BY created_at ASC',
      [req.params.id]
    );
    const [audits]: any = await pool.query(
      'SELECT id, action as content, performed_by_name as user_name, created_at, "audit" as type FROM audit_logs WHERE entity_type = "tickets" AND entity_id = ? ORDER BY created_at ASC',
      [req.params.id]
    );

    const timeline = [...comments, ...audits].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    res.json({ success: true, message: 'Timeline retrieved', data: timeline });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function logAudit(
  db: any, action: string, entityType: string, entityId: string,
  performedById: string, before: any, after: any
) {
  try {
    const [userRows]: any = await db.query('SELECT name FROM users WHERE id = ?', [performedById]);
    const performedByName = userRows[0]?.name || performedById;
    await db.query(
      `INSERT INTO audit_logs (id, action, entity_type, entity_id, performed_by_id, performed_by_name, before_state, after_state)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), action, entityType, entityId, performedById, performedByName,
        before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null]
    );
  } catch {
    // Audit logging must never crash the main request
  }
}

export default router;
