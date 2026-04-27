const express = require('express');
const Job     = require('../models/Job');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/jobs  — list with search & filters
router.get('/', async (req, res) => {
  try {
    const { search, location, type, category, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (search)   query.$text = { $search: search };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type)     query.type = type;
    if (category) query.category = category;

    const total = await Job.countDocuments(query);
    const jobs  = await Job.find(query)
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ jobs, total, pages: Math.ceil(total / limit), current: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company email website');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs  — employer only
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Only employers can post jobs' });
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/jobs/:id  — employer only, own jobs
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/employer/mine — employer's own jobs
router.get('/employer/mine', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Unauthorized' });
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
