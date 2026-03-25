const express = require('express');
const bcrypt = require('bcrypt');
const { query } = require('../db');

const router = express.Router();

const SALT_ROUNDS = 12;

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.redirect('/register.html?error=All fields are required');
    }
    if (username.length < 3) {
      return res.redirect('/register.html?error=Username must be at least 3 characters');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.redirect('/register.html?error=Invalid email format');
    }
    if (password.length < 8) {
      return res.redirect('/register.html?error=Password must be at least 8 characters');
    }
    if (password !== confirmPassword) {
      return res.redirect('/register.html?error=Passwords do not match');
    }

    const existing = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username]
    );
    if (existing.rows.length > 0) {
      return res.redirect('/register.html?error=Email or username already taken');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role',
      [email.toLowerCase(), username, passwordHash]
    );

    const user = result.rows[0];
    req.session.userId = user.id;
    req.session.user = { id: user.id, username: user.username, email: user.email, role: user.role };

    res.redirect('/investor_dashboard.html');
  } catch (err) {
    console.error('Register error:', err);
    res.redirect('/register.html?error=Something went wrong. Please try again.');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.redirect('/login.html?error=Email and password are required');
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.redirect('/login.html?error=Invalid email or password');
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.redirect('/login.html?error=Invalid email or password');
    }

    req.session.userId = user.id;
    req.session.user = { id: user.id, username: user.username, email: user.email, role: user.role };

    res.redirect('/investor_dashboard.html');
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login.html?error=Something went wrong. Please try again.');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/destane_landing_page.html');
  });
});

module.exports = router;
