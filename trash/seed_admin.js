
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else if (fs.existsSync(path.join(__dirname, '..', '.env'))) {
    dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

async function seedAdmin() {
    try {
        const pool = mysql.createPool({
            host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
            user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '1234',
            database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'devhub_db',
            port: process.env.MYSQLPORT || 3306,
        });

        const hashedPassword = await bcrypt.hash('admin123', 10);

        await pool.execute(`
            INSERT INTO users (id, full_name, email, password, role)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE password = ?, role = ?
        `, [
            'admin-id-001', 
            'AutomateHub Admin', 
            'admin@automatehub.in', 
            hashedPassword, 
            'admin',
            hashedPassword,
            'admin'
        ]);

        console.log("Admin account seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
}

seedAdmin();
