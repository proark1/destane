require('dotenv').config();

const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const path = require('path');
const { pool, initDb } = require('./db');
const { gateProtectedPages } = require('./middleware/auth');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  store: new PgSession({
    pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'destane-cinematic-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}));

// Auth API endpoint
app.get('/api/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({
      authenticated: true,
      user: req.session.user,
    });
  }
  res.json({ authenticated: false });
});

// Auth routes
app.use('/auth', authRoutes);

// Gate protected pages before serving static files
app.use(gateProtectedPages);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Start server
async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`DESTANE server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
