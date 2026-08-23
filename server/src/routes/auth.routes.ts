import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'yogi_ticketing_secret_key_2026_super_secure';
const JWT_EXPIRES_IN = '24h';
const REFRESH_EXPIRES_IN = '7d';

function signTokens(user: { id: string; email: string; role: string; organization_id?: string }) {
  const payload = { sub: user.id, email: user.email, role: user.role, orgId: user.organization_id };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
  const refreshToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN } as any);
  return { accessToken, refreshToken };
}

// ─── POST /auth/login ─────────────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const [rows]: any = await pool.query(
      'SELECT id, email, password, name, role, avatar_url, phone, status, organization_id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is disabled. Contact your administrator.' });
    }

    // ✅ Real bcrypt password verification
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = signTokens(user);

    // Map DB user to frontend AuthUser shape
    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || user.email.split('@')[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const authUser = {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      fullName: user.name || `${firstName} ${lastName}`.trim(),
      avatar: user.avatar_url || undefined,
      role: user.role,
      organizationId: user.organization_id || undefined,
      isEmailVerified: true,
      isTwoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: authUser, accessToken, refreshToken, permissions: [] },
    });
  } catch (err: any) {
    console.error('[auth/login]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── POST /auth/register ──────────────────────────────────────────────────────
router.post('/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ success: false, message: 'firstName, email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const [existing]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();
    const fullName = `${firstName} ${lastName || ''}`.trim();

    await pool.query(
      `INSERT INTO users (id, email, password, name, role, status) VALUES (?, ?, ?, ?, 'agent', 'active')`,
      [id, email.toLowerCase().trim(), hashedPassword, fullName]
    );

    const newUser = { id, email, role: 'agent' };
    const { accessToken, refreshToken } = signTokens(newUser as any);

    const authUser = {
      id,
      email: email.toLowerCase().trim(),
      firstName,
      lastName: lastName || '',
      fullName,
      role: 'agent',
      isEmailVerified: false,
      isTwoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user: authUser, accessToken, refreshToken, permissions: [] },
    });
  } catch (err: any) {
    console.error('[auth/register]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── GET /auth/me (protected) ─────────────────────────────────────────────────
router.get('/auth/me', authenticate, async (req, res) => {
  try {
    const userId = req.user!.sub;
    const [rows]: any = await pool.query(
      'SELECT id, email, name, role, avatar_url, phone, status, organization_id FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    const nameParts = (user.name || '').split(' ');

    res.json({
      success: true,
      message: 'User profile fetched',
      data: {
        id: user.id,
        email: user.email,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        fullName: user.name || '',
        avatar: user.avatar_url || undefined,
        role: user.role,
        organizationId: user.organization_id || undefined,
        isEmailVerified: true,
        isTwoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[auth/me]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── POST /auth/refresh ───────────────────────────────────────────────────────
router.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const payload: any = jwt.verify(refreshToken, JWT_SECRET);
    const [rows]: any = await pool.query(
      'SELECT id, email, role, organization_id FROM users WHERE id = ?',
      [payload.sub]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    const { accessToken, refreshToken: newRefreshToken } = signTokens(user);

    res.json({
      success: true,
      message: 'Token refreshed',
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

// ─── POST /auth/forgot-password ───────────────────────────────────────────────
router.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const [rows]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      return res.json({ success: true, message: 'If an account exists for this email, a reset link will be sent.' });
    }

    // TODO: integrate nodemailer for real email delivery
    // For now, generate a reset token and log it
    const resetToken = jwt.sign({ sub: rows[0].id, purpose: 'reset' }, JWT_SECRET, { expiresIn: '1h' } as any);
    console.log(`[AUTH] Password reset token for ${email}: ${resetToken}`);

    res.json({ success: true, message: 'If an account exists for this email, a reset link will be sent.' });
  } catch (err: any) {
    console.error('[auth/forgot-password]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── POST /auth/reset-password ────────────────────────────────────────────────
router.post('/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const payload: any = jwt.verify(token, JWT_SECRET);
    if (payload.purpose !== 'reset') {
      return res.status(400).json({ success: false, message: 'Invalid reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, payload.sub]);

    res.json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new one.' });
    }
    res.status(400).json({ success: false, message: 'Invalid reset token' });
  }
});

// ─── POST /auth/logout ────────────────────────────────────────────────────────
router.post('/auth/logout', authenticate, (_req, res) => {
  // Stateless JWT: token invalidation happens client-side
  // For production, maintain a token blocklist in Redis
  res.json({ success: true, message: 'Logged out successfully', data: null });
});

export default router;
