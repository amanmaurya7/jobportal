const express     = require('express');
const Application = require('../models/Application');
const Job         = require('../models/Job');
const auth        = require('../middleware/auth');
const router      = express.Router();

// POST /api/applications/:jobId — jobseeker applies
router.post('/:jobId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') return res.status(403).json({ message: 'Only jobseekers can apply' });
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const app = await Application.create({ job: req.params.jobId, applicant: req.user.id, coverLetter: req.body.coverLetter || '' });
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/applications/my — jobseeker's applications
router.get('/my', auth, async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location type salary')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/job/:jobId — employer views applicants
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const apps = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills location resume')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/applications/:id/status — employer updates status
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Unauthorized' });
    const app = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
