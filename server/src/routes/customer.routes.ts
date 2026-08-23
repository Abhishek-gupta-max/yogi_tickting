import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

// GET /customers
router.get('/customers', async (_req, res) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT c.*, o.name as organization_name,
        (SELECT COUNT(*) FROM tickets t WHERE t.customer_email = c.email) as total_tickets
       FROM customers c
       LEFT JOIN organizations o ON c.organization_id = o.id
       ORDER BY c.created_at DESC`
    );
    res.json({ success: true, message: 'Customers fetched', data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /customers/:id
router.get('/customers/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer fetched', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /customers
router.post('/customers', async (req, res) => {
  try {
    const { name, email, phone, organization_id } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'name and email are required' });

    const id = uuidv4();
    await pool.query(
      'INSERT INTO customers (id, name, email, phone, organization_id) VALUES (?, ?, ?, ?, ?)',
      [id, name, email.toLowerCase().trim(), phone || null, organization_id || null]
    );

    const [rows]: any = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    res.status(201).json({ success: true, message: 'Customer created', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /customers/:id
router.patch('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, organization_id, status } = req.body;

    await pool.query(
      `UPDATE customers SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        organization_id = COALESCE(?, organization_id),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [name || null, email ? email.toLowerCase().trim() : null, phone || null, organization_id || null, status || null, id]
    );

    const [rows]: any = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer updated', data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /customers/:id
router.delete('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM customers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Customer deleted', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
