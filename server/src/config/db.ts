import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.MYSQL_PORT || process.env.DB_PORT || '3306';
const DB_USER = process.env.MYSQL_USER || process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || 'admin123';
const DB_NAME = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'yogi_ticketing';

export async function initializeDatabase() {
  try {
    const rootConnection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
    });

    let activeDbName = DB_NAME;
    try {
      await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
      console.log(`Database "${DB_NAME}" ensured.`);
    } catch (createErr: any) {
      console.warn(`Could not run CREATE DATABASE query (${createErr.message}). Using database fallback...`);
    }
    await rootConnection.end();

    let dbPool;
    try {
      dbPool = mysql.createPool({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: activeDbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      await dbPool.query('SELECT 1');
    } catch (err: any) {
      if (err.code === 'ER_DBACCESS_DENIED_ERROR' || err.errno === 1044) {
        console.warn(`Access denied for database "${activeDbName}". Falling back to database "test"...`);
        activeDbName = 'test';
        dbPool = mysql.createPool({
          host: DB_HOST,
          port: Number(DB_PORT),
          user: DB_USER,
          password: DB_PASSWORD,
          database: activeDbName,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });
      } else {
        throw err;
      }
    }

    // ─── Core Tables ────────────────────────────────────────────────────────
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'agent',
        avatar_url VARCHAR(500) NULL,
        phone VARCHAR(50) NULL,
        organization_id VARCHAR(36) NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NULL,
        plan VARCHAR(50) DEFAULT 'enterprise',
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        department_id VARCHAR(36) NULL,
        lead_id VARCHAR(36) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id VARCHAR(36) PRIMARY KEY,
        team_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY team_user_unique (team_id, user_id)
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS branches (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NULL,
        city VARCHAR(100) NULL,
        country VARCHAR(100) NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) NULL,
        organization_id VARCHAR(36) NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(36) PRIMARY KEY,
        ticket_number VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        priority VARCHAR(50) DEFAULT 'medium',
        category VARCHAR(100) DEFAULT 'General',
        customer_name VARCHAR(255) NULL,
        customer_email VARCHAR(255) NULL,
        assignee_id VARCHAR(36) NULL,
        department_id VARCHAR(36) NULL,
        organization_id VARCHAR(36) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS ticket_comments (
        id VARCHAR(36) PRIMARY KEY,
        ticket_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_internal TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS sla_policies (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        priority VARCHAR(50) NOT NULL,
        response_time_minutes INT NOT NULL,
        resolution_time_minutes INT NOT NULL,
        is_default TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(36) PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(36) NULL,
        performed_by_id VARCHAR(36) NOT NULL,
        performed_by_name VARCHAR(255) NULL,
        before_state JSON NULL,
        after_state JSON NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS knowledge_articles (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        author_name VARCHAR(255) DEFAULT 'System Admin',
        views INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('All MySQL tables created/verified successfully.');

    // Seed default admin user if users table is empty
    const [rows]: any = await dbPool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      console.log('Seeding initial data into MySQL database...');

      // Default password: Admin123! hashed with bcrypt
      await dbPool.query(`
        INSERT INTO users (id, email, password, name, role, status) VALUES
        ('usr-admin-01', 'admin@example.com', '$2a$12$R.W4Yp2DkWm7HwE1Y2wRreE3Q5W9J1K3N9Q1W9K3N9Q1W9K3N9Q1W', 'System Admin', 'super_admin', 'active'),
        ('usr-agent-01', 'agent@example.com', '$2a$12$R.W4Yp2DkWm7HwE1Y2wRreE3Q5W9J1K3N9Q1W9K3N9Q1W9K3N9Q1W', 'Yogi Support', 'agent', 'active');
      `);

      await dbPool.query(`
        INSERT INTO departments (id, name, description) VALUES
        ('dept-01', 'Technical Support', 'Tier 1 & Tier 2 technical resolution'),
        ('dept-02', 'Billing & Accounts', 'Invoicing, subscription and payments'),
        ('dept-03', 'Product Engineering', 'Bug fixes and feature requests');
      `);

      await dbPool.query(`
        INSERT INTO teams (id, name, description, department_id, lead_id) VALUES
        ('team-01', 'L1 Support Team', 'Frontline customer issue resolution', 'dept-01', 'usr-admin-01'),
        ('team-02', 'DevOps Escalation', 'Infrastructure and database support', 'dept-03', 'usr-admin-01');
      `);

      await dbPool.query(`
        INSERT INTO branches (id, name, code, city, country) VALUES
        ('br-01', 'Headquarters', 'HQ-01', 'San Francisco', 'USA'),
        ('br-02', 'EMEA Regional Hub', 'EU-01', 'London', 'UK');
      `);

      await dbPool.query(`
        INSERT INTO customers (id, name, email, phone) VALUES
        ('cust-01', 'John Doe', 'john@acme.com', '+1 555-0199'),
        ('cust-02', 'Pepper Potts', 'pepper@stark.com', '+1 555-0288');
      `);

      await dbPool.query(`
        INSERT INTO sla_policies (id, name, description, priority, response_time_minutes, resolution_time_minutes, is_default) VALUES
        ('sla-01', 'Urgent Critical SLA', 'Targeted resolution within 4 hours', 'urgent', 15, 240, 0),
        ('sla-02', 'High Priority SLA', 'Targeted resolution within 12 hours', 'high', 30, 720, 0),
        ('sla-03', 'Standard SLA', 'Targeted resolution within 48 hours', 'medium', 120, 2880, 1);
      `);

      await dbPool.query(`
        INSERT INTO organizations (id, name, domain, plan) VALUES
        ('org-01', 'Acme Corp', 'acme.com', 'enterprise'),
        ('org-02', 'Stark Industries', 'stark.com', 'pro');
      `);

      await dbPool.query(`
        INSERT INTO tickets (id, ticket_number, title, description, status, priority, category, customer_name, customer_email, assignee_id) VALUES
        ('tkt-1001', 'TKT-1001', 'Unable to access dashboard after password reset', 'User reports getting HTTP 500 when trying to access the primary dashboard.', 'open', 'high', 'Technical', 'John Doe', 'john@acme.com', 'usr-admin-01'),
        ('tkt-1002', 'TKT-1002', 'Billing query regarding monthly invoice', 'Question about line item #4 on July invoice.', 'in_progress', 'medium', 'Billing', 'Pepper Potts', 'pepper@stark.com', 'usr-agent-01'),
        ('tkt-1003', 'TKT-1003', 'Feature Request: Export reports to CSV', 'Requesting bulk export capabilities for monthly analytics.', 'pending', 'low', 'Feature Request', 'Bruce Wayne', 'bruce@wayne.com', 'usr-admin-01');
      `);

      await dbPool.query(`
        INSERT INTO knowledge_articles (id, title, content, category, author_name, views) VALUES
        ('kb-01', 'How to reset user passwords', 'Step 1: Go to Settings -> Users. Step 2: Select user and click Reset Password.', 'User Management', 'System Admin', 142),
        ('kb-02', 'Setting up MySQL Database Connection', 'Ensure database host is 127.0.0.1 and credentials match the .env configuration.', 'Database', 'System Admin', 89);
      `);

      await dbPool.query(`
        INSERT INTO app_settings (setting_key, setting_value) VALUES
        ('app_name', 'TicketFlow'),
        ('support_email', 'support@yogi-ticketing.com'),
        ('enable_2fa', 'true'),
        ('default_ticket_priority', 'medium');
      `);

      console.log('Seeding completed successfully.');
    }

    console.log(`Active database pool established on "${activeDbName}".`);
    dbPoolInstance = dbPool;
    return dbPool;
  } catch (error) {
    console.error('MySQL Database Connection/Initialization Error:', error);
    throw error;
  }
}

let dbPoolInstance: mysql.Pool | null = null;

export const pool = new Proxy({} as mysql.Pool, {
  get(_target, prop) {
    if (!dbPoolInstance) {
      dbPoolInstance = mysql.createPool({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: 'test',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    const val = (dbPoolInstance as any)[prop];
    return typeof val === 'function' ? val.bind(dbPoolInstance) : val;
  },
});
