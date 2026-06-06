const mysql = require('mysql2/promise');
const fs = require('fs');

async function initDB() {
    try {
        const pool = mysql.createPool('mysql://root:yGdkjTqYeuibfvzRUFILxRYHECwtPxFh@acela.proxy.rlwy.net:26390/railway?multipleStatements=true');
        console.log("Connecting and executing init.sql...");
        
        let sql = fs.readFileSync('init.sql', 'utf8');
        
        // Remove CREATE DATABASE and USE statements since Railway enforces its own DB name 'railway'
        sql = sql.replace(/CREATE DATABASE IF NOT EXISTS store_rating_db;/g, '');
        sql = sql.replace(/USE store_rating_db;/g, '');
        
        await pool.query(sql);
        console.log("Database initialized successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}
initDB();
