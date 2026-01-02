-- Developers Hub MySQL Schema
-- Migration from Supabase/PostgreSQL to Local MySQL

CREATE DATABASE IF NOT EXISTS devhub_db;
USE devhub_db;

-- 1. USERS (Combined Auth + Profiles)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- For local auth
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

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    full_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    tech_tag VARCHAR(100) NOT NULL,
    image_url TEXT,
    features JSON, -- Stored as JSON array
    delivery_method VARCHAR(100) NOT NULL,
    delivery_content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. JUNCTION: PRODUCT_CATEGORIES
CREATE TABLE IF NOT EXISTS product_categories (
    product_id VARCHAR(50),
    category_id VARCHAR(50),
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 5. ORDERS
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

-- 6. ORDER_ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(50),
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    product_metadata JSON, -- Stored as JSON object
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- INITIAL DATA
INSERT IGNORE INTO categories (id, name, slug, icon, description, priority) VALUES 
('cat-ai', 'AI Automation', 'ai-automation', 'Zap', 'Workflows for Make, n8n, and custom AI agents.', 1),
('cat-soft', 'Software', 'software', 'Code', 'Production-ready web apps and landing pages.', 2);

INSERT IGNORE INTO products (id, name, slug, description, full_description, price, discount_price, tech_tag, image_url, features, delivery_method, delivery_content, is_published) VALUES 
('p1', 'AI Lead Researcher', 'ai-lead-researcher', 'Automated lead generation using OpenAI and Make.com', 'A comprehensive workflow...', 49.00, 29.00, 'Make.com', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', '["API Integration"]', 'File Download', 'https://example.com/download/ai-lead-gen.json', 1),
('p2', 'SaaS Dashboard Pro', 'saas-dashboard-pro', 'Full-stack Next.js admin template with auth.', 'A complete SaaS boilerplate...', 99.00, 79.00, 'Next.js', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', '["Auth Ready"]', 'Private Link', 'https://github.com/autoflow/dashboard-pro-private', 1);

INSERT IGNORE INTO product_categories (product_id, category_id) VALUES ('p1', 'cat-ai'), ('p2', 'cat-soft');

-- DEFAULT ADMIN (Password: admin123 - should be hashed in production)
INSERT IGNORE INTO users (id, full_name, email, password, role) VALUES 
('admin-id-1', 'Admin', 'admin@devhub.com', 'admin123', 'admin');
