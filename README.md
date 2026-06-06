## Deployment Link - 

# Store Rating Platform - rapid development version / unpolished

A minimalistic role-based web application built for users to submit, manage, and view ratings for registered stores.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Express.js (Node.js)
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)

---

## Setup & Installation

### 1. Database Setup
1. Ensure your MySQL server is running.
2. Import the `backend/init.sql` file to automatically create the `store_rating_db` database, tables, and populate it with sample data.
3. Open `backend/.env` and update the `DB_USER` and `DB_PASSWORD` if your local MySQL credentials differ from the defaults.

### 2. Backend Initialization
```bash
cd backend
npm install
node server.js
```
*The API will run on `http://localhost:5000`*

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```
*The web app will run locally (usually on `http://localhost:5173`)*

---

## 👥 User Roles & Functional Guide

### 1. System Administrator
- **Credentials:** `admin@example.com` / `Admin@123`
- **Capabilities:**
  - View a high-level dashboard displaying total users and stores.
  - View a master list of all registered users, stores, and their average ratings.
  - Create new normal users, store owners, or other admins directly from the dashboard.

### 2. Store Owner
- **Credentials:** `store1@example.com` / `Store@123`
- **Capabilities:**
  - View their store's overall average rating out of 5.
  - See a detailed breakdown of which specific users submitted ratings for their store and what scores they gave.

### 3. Normal User
- **Credentials:** `user1@example.com` / `User@123`
- **Capabilities:**
  - Register a new account via the Signup page.
  - View a list of all available stores and their current average ratings.
  - Search/filter stores by Name or Address.
  - Submit a new 1-to-5 star rating or modify their existing rating for any store.

---
