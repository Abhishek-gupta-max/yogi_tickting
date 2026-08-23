import { Router } from 'express';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

// GET /notifications
router.get('/notifications', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const [rows]: any = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    res.json({ success: true, message: 'Notifications fetched', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /notifications/read-all
router.patch('/notifications/read-all', async (req, res) => {
  try {
    const userId = req.user!.sub;
    await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL', [userId]);
    res.json({ success: true, message: 'All notifications marked as read', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /notifications/:id/read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Notification marked as read', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
