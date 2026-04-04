const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const isAdmin = adminSecret === 'DROPSHOP_ADMIN_2024';
    const user    = await User.create({ name, email, password, isAdmin });
    res.status(201).json({
      token: signToken(user._id),
      user:  { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      token: signToken(user._id),
      user:  { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/me', protect, (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, isAdmin: req.user.isAdmin });
});

module.exports = router;