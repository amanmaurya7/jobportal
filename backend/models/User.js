const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['jobseeker', 'employer'], default: 'jobseeker' },
  // Jobseeker fields
  resume:   { type: String, default: '' },
  skills:   [{ type: String }],
  location: { type: String, default: '' },
  // Employer fields
  company:  { type: String, default: '' },
  website:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
