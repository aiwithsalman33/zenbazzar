-- AutomateHub MySQL Schema
-- Extended from Zenbazzar base schema

CREATE DATABASE IF NOT EXISTS devhub_db;
USE devhub_db;

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(100) NOT NULL,
    description TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS (Templates)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    full_description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_price DECIMAL(10,2),
    tech_tag VARCHAR(100) NOT NULL DEFAULT 'n8n',
    image_url TEXT,
    features JSON,
    delivery_method VARCHAR(100) NOT NULL DEFAULT 'File Download',
    delivery_content TEXT NOT NULL DEFAULT '',
    is_published BOOLEAN DEFAULT TRUE,
    -- AutomateHub additions
    plan_access_level ENUM('free', 'starter', 'pro', 'enterprise') DEFAULT 'free',
    is_monthly_drop BOOLEAN DEFAULT FALSE,
    month_drop_date VARCHAR(10),
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. PRODUCT_CATEGORIES junction
CREATE TABLE IF NOT EXISTS product_categories (
    product_id VARCHAR(50),
    category_id VARCHAR(50),
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 5. TEMPLATE TAGS
CREATE TABLE IF NOT EXISTS template_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    template_id VARCHAR(50) NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (template_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Awaiting Verification', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    payment_id VARCHAR(255),
    screenshot_url TEXT,
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. ORDER_ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(50),
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    product_metadata JSON,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 8. SUBSCRIPTIONS (AutomateHub)
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    plan ENUM('starter', 'pro', 'enterprise') NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    amount DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    razorpay_subscription_id VARCHAR(255),
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. PURCHASES (one-time template purchases)
CREATE TABLE IF NOT EXISTS purchases (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_id VARCHAR(255),
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 10. MONTHLY ADD-ONS
CREATE TABLE IF NOT EXISTS monthly_addons (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    month VARCHAR(7) NOT NULL,  -- e.g. '2025-03'
    plan_tier ENUM('starter', 'pro') NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_id VARCHAR(255),
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_month (user_id, month),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. USER ACCESS (manual grants by admin)
CREATE TABLE IF NOT EXISTS user_access (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    template_id VARCHAR(50),
    category_id VARCHAR(50),
    granted_by_admin BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    note TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 12. CUSTOM REQUESTS
CREATE TABLE IF NOT EXISTS custom_requests (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    project_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- SEED DATA: AutomateHub Categories
INSERT IGNORE INTO categories (id, name, slug, icon, description, priority) VALUES
('cat-google', 'Google Suite', 'google-suite', 'Globe', 'Google Sheets, Drive, Gmail, Calendar, Meet, Docs, Forms, Analytics — 600+ templates', 1),
('cat-slack', 'Slack', 'slack', 'MessageSquare', 'Slack notifications, alerts, and workflow automations', 2),
('cat-notion', 'Notion', 'notion', 'FileText', 'Notion database sync, page creation, and task automation', 3),
('cat-hubspot', 'HubSpot', 'hubspot', 'BarChart3', 'CRM automation, lead management, and pipeline workflows', 4),
('cat-shopify', 'Shopify', 'shopify', 'ShoppingBag', 'E-commerce automation, order management, and inventory sync', 5),
('cat-whatsapp', 'WhatsApp Business', 'whatsapp', 'Phone', 'WhatsApp Business API automations and messaging flows', 6),
('cat-ai', 'AI Agents', 'ai-agents', 'Bot', 'OpenAI, Claude, and custom AI agent workflows', 7),
('cat-clickup', 'ClickUp', 'clickup', 'CheckSquare', 'Task management, project tracking, and team automation', 8),
('cat-airtable', 'Airtable', 'airtable', 'Table', 'Database automation, record syncing, and form triggers', 9),
('cat-telegram', 'Telegram', 'telegram', 'Send', 'Telegram bot automation and notification workflows', 10),
('cat-jira', 'Jira', 'jira', 'Bug', 'Development workflow automation and issue tracking', 11),
('cat-trello', 'Trello', 'trello', 'Columns', 'Board management and card automation workflows', 12),
('cat-salesforce', 'Salesforce', 'salesforce', 'CloudLightning', 'CRM pipeline automation and data sync workflows', 13),
('cat-zapier', 'Zapier Migration', 'zapier-migration', 'Repeat', 'Migrate your Zapier workflows to n8n instantly', 14),
('cat-github', 'GitHub', 'github', 'GitBranch', 'Developer workflow automation, CI/CD, and repo management', 15),
('cat-stripe', 'Stripe / Razorpay', 'payment', 'CreditCard', 'Payment automation, subscription management, and billing flows', 16);

-- SEED ADMIN
INSERT IGNORE INTO users (id, full_name, email, password, role) VALUES
('admin-id-001', 'AutomateHub Admin', 'admin@automatehub.in', 'admin123', 'admin');

-- SAMPLE FREE TEMPLATES
INSERT IGNORE INTO products (id, name, slug, description, full_description, price, tech_tag, plan_access_level, image_url, features, delivery_method, delivery_content, is_published, is_monthly_drop) VALUES
('tmpl-001', 'Google Sheets Auto-Sync', 'google-sheets-auto-sync', 'Automatically sync data between two Google Sheets whenever a row is added or updated.', 'This n8n workflow triggers whenever a new row is added to your source Google Sheet and automatically syncs the data to a destination sheet. Perfect for keeping multiple teams in sync.', 0, 'n8n', 'free', 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80', '["Zero-config setup","Bidirectional sync","Error handling","Webhook trigger"]', 'File Download', 'https://example.com/workflows/sheets-sync.json', 1, 0),
('tmpl-002', 'Slack Daily Standup Bot', 'slack-standup-bot', 'Automated daily standup collection sent via Slack. Collects responses and compiles to Notion.', 'Sends scheduled DMs to team members asking for standup updates, collects their responses, and compiles a daily summary in a Notion database.', 499, 'n8n', 'starter', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80', '["Scheduled triggers","DM collection","Notion integration","Team summary"]', 'File Download', 'https://example.com/workflows/slack-standup.json', 1, 1),
('tmpl-003', 'HubSpot Lead Enricher AI', 'hubspot-lead-enricher-ai', 'Automatically enrich HubSpot leads using OpenAI to add company info and personalized notes.', 'When a new lead lands in HubSpot, this workflow uses OpenAI GPT to research the company, extract key info, and add personalized notes to the lead record. Saves 15+ minutes per lead.', 999, 'OpenAI', 'pro', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', '["OpenAI GPT-4","HubSpot CRM","Auto-enrichment","Custom prompts"]', 'File Download', 'https://example.com/workflows/hubspot-ai.json', 1, 0);

INSERT IGNORE INTO product_categories (product_id, category_id) VALUES
('tmpl-001', 'cat-google'),
('tmpl-002', 'cat-slack'),
('tmpl-003', 'cat-hubspot'),
('tmpl-003', 'cat-ai');
