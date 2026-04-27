const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'], default: 'Full-time' },
  salary:      { type: String, default: 'Not disclosed' },
  description: { type: String, required: true },
  requirements:[{ type: String }],
  skills:      [{ type: String }],
  experience:  { type: String, default: '0-1 years' },
  category:    { type: String, default: 'IT' },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// Text search index
jobSchema.index({ title: 'text', company: 'text', skills: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
