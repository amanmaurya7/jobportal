const express = require('express');
const User    = require('../models/User');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/profile/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile/me
router.put('/me', auth, async (req, res) => {
  try {
    const { password, email, role, ...updates } = req.body; // prevent changing sensitive fields
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
