const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = process.env.DATABASE_URL 
    ? mysql.createPool(process.env.DATABASE_URL)
    : mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) return res.status(401).json({ error: 'Access denied, token missing!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token is not valid!' });
        req.user = user;
        next();
    });
};

// Middleware to check Admin role
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Requires Admin privileges' });
    }
    next();
};

// 1. LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            const user = users[0];
            const token = jwt.sign(
                { id: user.id, role: user.role, email: user.email }, 
                process.env.JWT_SECRET, 
                { expiresIn: '2h' }
            );
            res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed. Did you run init.sql and check .env credentials?' });
    }
});

// 2. SIGNUP (For normal users)
app.post('/api/signup', async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)', 
            [name, email, password, address, 'normal']
        );
        res.json({ message: 'Signup successful' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
        res.status(500).json({ error: err.message });
    }
});

// 3. ADMIN: ADD USER (Normal or Store Owner or Admin)
app.post('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    const { name, email, password, address, role } = req.body;
    try {
        await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)', 
            [name, email, password, address, role]
        );
        res.json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ADMIN: GET ALL USERS
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, address, role FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. GET ALL STORES (Normal Users & Admin)
// Store listings should display Store Name, Address, Overall Rating, and User's Submitted Rating
app.get('/api/stores', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        // Query to get stores, their average rating, and the current user's rating for that store
        const [stores] = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.address, 
                IFNULL(AVG(r.rating), 0) as overall_rating,
                (SELECT rating FROM ratings WHERE store_id = u.id AND user_id = ?) as user_submitted_rating
            FROM users u 
            LEFT JOIN ratings r ON u.id = r.store_id 
            WHERE u.role = 'store_owner' 
            GROUP BY u.id
        `, [userId]);
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. SUBMIT OR MODIFY RATING
app.post('/api/ratings', authenticateToken, async (req, res) => {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;
    
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });

    try {
        await pool.query(`
            INSERT INTO ratings (user_id, store_id, rating) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE rating = ?`, 
            [user_id, store_id, rating, rating]
        );
        res.json({ message: 'Rating saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. STORE OWNER: GET USERS WHO RATED THEIR STORE
app.get('/api/store/dashboard', authenticateToken, async (req, res) => {
    if (req.user.role !== 'store_owner') return res.status(403).json({ error: 'Access denied' });
    
    const store_id = req.user.id;
    try {
        const [ratings] = await pool.query(`
            SELECT u.name, u.email, r.rating 
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
        `, [store_id]);
        
        const [avg] = await pool.query('SELECT IFNULL(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = ?', [store_id]);
        
        res.json({ 
            users: ratings,
            average_rating: avg[0].average_rating
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. CHANGE PASSWORD
app.post('/api/change-password', authenticateToken, async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.user.id;
    try {
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});