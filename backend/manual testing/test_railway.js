const mysql = require('mysql2/promise');

async function test() {
    try {
        const pool = mysql.createPool('mysql://root:yGdkjTqYeuibfvzRUFILxRYHECwtPxFh@acela.proxy.rlwy.net:26390/railway');
        console.log("Connecting...");
        const [rows] = await pool.query('SHOW TABLES');
        console.log("Tables found:", rows);
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}
test();
