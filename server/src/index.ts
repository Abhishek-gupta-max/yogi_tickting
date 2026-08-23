import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/db.js';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import userRoutes from './routes/user.routes.js';
import teamRoutes from './routes/team.routes.js';
import branchRoutes from './routes/branch.routes.js';
import customerRoutes from './routes/customer.routes.js';
import slaRoutes from './routes/sla.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import auditRoutes from './routes/audit.routes.js';
import settingsRoutes from './routes/settings.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Routes mounted at /api/v1
app.use('/api/v1', healthRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', ticketRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', teamRoutes);
app.use('/api/v1', branchRoutes);
app.use('/api/v1', customerRoutes);
app.use('/api/v1', slaRoutes);
app.use('/api/v1', notificationRoutes);
app.use('/api/v1', reportsRoutes);
app.use('/api/v1', auditRoutes);
app.use('/api/v1', settingsRoutes);

// Fallback error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server & Connect Database
async function startServer() {
  try {
    console.log('Initializing MySQL Database Connection...');
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`================================================`);
      console.log(`🚀 TicketFlow Backend API Server running on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
      console.log(`🗄️ MySQL Host: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}`);
      console.log(`================================================`);
    });
  } catch (error) {
    console.error('Failed to start backend server:', error);
    process.exit(1);
  }
}

startServer();
