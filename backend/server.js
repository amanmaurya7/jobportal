const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes    = require('./routes/auth');
const jobRoutes     = require('./routes/jobs');
const profileRoutes = require('./routes/profile');
const applicationRoutes = require('./routes/applications');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/jobs',         jobRoutes);
app.use('/api/profile',      profileRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Job Portal API running' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
