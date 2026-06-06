CREATE DATABASE IF NOT EXISTS store_rating_db;
USE store_rating_db;

DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('admin', 'normal', 'store_owner') NOT NULL DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT CHECK(rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id)
);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- 1. Insert System Administrator
INSERT INTO users (id, name, email, password, address, role) VALUES 
(1, 'System Administrator User', 'admin@example.com', 'Admin@123', 'Admin HQ Building, City Center', 'admin');

-- 2. Insert Store Owners (Stores)
INSERT INTO users (id, name, email, password, address, role) VALUES 
(2, 'Tech Gadgets Store Inc.', 'store1@example.com', 'Store@123', '123 Silicon Valley Road', 'store_owner'),
(3, 'Fresh Organic Groceries', 'store2@example.com', 'Store@123', '456 Farmer Market Ave', 'store_owner'),
(4, 'Downtown Coffee Shop', 'store3@example.com', 'Store@123', '789 Main Street Plaza', 'store_owner'),
(5, 'Modern Book Haven', 'store4@example.com', 'Store@123', '101 Library Boulevard', 'store_owner');

-- 3. Insert Normal Users
INSERT INTO users (id, name, email, password, address, role) VALUES 
(6, 'Johnathan Doe Tester', 'user1@example.com', 'User@123', 'Apt 4B, Residential Block', 'normal'),
(7, 'Jane Smith Consumer', 'user2@example.com', 'User@123', 'Suite 100, West End', 'normal'),
(8, 'Alice Wonderland Shopper', 'user3@example.com', 'User@123', '55 Dreamland Street', 'normal');

-- 4. Insert Sample Ratings
-- Johnathan (user 6) rates Tech Gadgets (2) and Groceries (3)
INSERT INTO ratings (user_id, store_id, rating) VALUES 
(6, 2, 5),
(6, 3, 4);

-- Jane (user 7) rates Tech Gadgets (2), Coffee Shop (4), Book Haven (5)
INSERT INTO ratings (user_id, store_id, rating) VALUES 
(7, 2, 4),
(7, 4, 5),
(7, 5, 3);

-- Alice (user 8) rates Groceries (3) and Coffee Shop (4)
INSERT INTO ratings (user_id, store_id, rating) VALUES 
(8, 3, 5),
(8, 4, 2);
