import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

// Register new user
router.post('/register', (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const newUser = db.createUser({
      name,
      email,
      password,
      age: age ? Number(age) : 30,
      gender: gender || 'Not specified'
    });

    // Strip password in response
    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({
      message: 'Account created successfully',
      user: userSafe,
      token: `token-${newUser.id}`
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { password: _, ...userSafe } = user;
    return res.json({
      message: 'Logged in successfully',
      user: userSafe,
      token: `token-${user.id}`
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 1-Click Demo Login (for Hackathon judges & quick review)
router.post('/demo', (req, res) => {
  try {
    let demoUser = db.getUserById('demo-user-123');
    if (!demoUser) {
      db.resetDemo();
      demoUser = db.getUserById('demo-user-123');
    }
    const { password: _, ...userSafe } = demoUser;
    return res.json({
      message: 'Logged in as Demo Patient (Sarah Jenkins)',
      user: userSafe,
      token: `token-${demoUser.id}`,
      isDemo: true
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get current profile
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const userId = authHeader ? authHeader.replace('Bearer token-', '').trim() : 'demo-user-123';
  const user = db.getUserById(userId) || db.getUserById('demo-user-123');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...userSafe } = user;
  return res.json({ user: userSafe });
});

export default router;
