import { Router } from 'express';
import { pool } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

// GET /audit-logs
router.get('/audit-logs', requireRole('super_admin', 'company_admin'), async (req, res) => {
  try {
    const { entity_type, performed_by_id, page = '1', pageSize = '50' } = req.query as Record<string, string>;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (entity_type)     { where += ' AND entity_type = ?';     params.push(entity_type); }
    if (performed_by_id) { where += ' AND performed_by_id = ?'; params.push(performed_by_id); }

    const [countRows]: any = await pool.query(`SELECT COUNT(*) as total FROM audit_logs ${where}`, params);
    const total = countRows[0].total;

    const [rows]: any = await pool.query(
      `SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    res.json({
      success: true,
      message: 'Audit logs retrieved',
      data: rows,
      meta: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / parseInt(pageSize)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
