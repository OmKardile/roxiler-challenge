const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        console.log("Connected to MySQL server successfully!");
        
        const [databases] = await connection.query('SHOW DATABASES LIKE "store_rating_db"');
        if (databases.length > 0) {
            console.log("Database 'store_rating_db' exists.");
            await connection.changeUser({ database: 'store_rating_db' });
            const [tables] = await connection.query('SHOW TABLES');
            console.log("Tables:", tables);
        } else {
            console.log("Database 'store_rating_db' DOES NOT EXIST.");
        }
        
        await connection.end();
    } catch (err) {
        console.error("MySQL Connection Error:", err.message);
    }
}
testConnection();
