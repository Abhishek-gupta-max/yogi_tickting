import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT 1 as db_status');
    res.json({
      success: true,
      message: 'Server & MySQL database are healthy',
      data: {
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: rows[0].db_status === 1 ? 'Connected (MySQL 127.0.0.1:3306)' : 'Disconnected',
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Database connection check failed',
      error: err.message,
    });
  }
});

export default router;
