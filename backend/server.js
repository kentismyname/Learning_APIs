require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Check database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database query error' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already taken!' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
                if (err) return res.status(500).json({ message: 'Error registering user' });
                res.json({ message: 'User registered successfully!' });
            });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
        if (err) return res.status(500).json({ message: 'Database query error' });
        if (users.length === 0) {
            return res.status(401).json({ message: 'User not found!' });
        }

        const user = users[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords' });
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password!' });
            }

            // Check if token already exists
            if (user.token) {
                return res.json({ token: user.token });
            }

            // Generate token and save it in the database
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id], (err) => {
                if (err) return res.status(500).json({ message: 'Error saving token' });
                res.json({ token }); // Send the token to the client
            });
        });
    });
});

// Protected route (example)
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token!' });
        res.json({ message: 'Protected route accessed!', userId: decoded.id });
    });
});

// Logout (client-side will remove token)
app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out!' });
});

// Start server
app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});
