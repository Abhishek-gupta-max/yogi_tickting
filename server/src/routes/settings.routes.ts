import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// GET settings
router.get('/settings', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT setting_key, setting_value FROM app_settings');
    const settingsObj: Record<string, string> = {};
    for (const row of rows) {
      settingsObj[row.setting_key] = row.setting_value;
    }
    res.json({
      success: true,
      message: 'Settings retrieved',
      data: settingsObj,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE settings
router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, String(value), String(value)]
      );
    }
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
