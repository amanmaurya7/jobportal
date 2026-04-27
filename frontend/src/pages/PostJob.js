import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TYPES = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
const CATS  = ['IT', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'HR'];
const EXP   = ['0-1 years', '1-2 years', '2-5 years', '5-10 years', '10+ years'];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time', salary: '',
    description: '', category: 'IT', experience: '0-1 years',
    requirements: '', skills: '',
  });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').filter(Boolean),
        skills:       form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await axios.post('/api/jobs', payload);
      setSuccess('Job posted successfully!');
      setTimeout(() => navigate(`/jobs/${data._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally { setLoading(false); }
  };

  const f = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="container page" style={{ maxWidth: 700 }}>
      <h1 className="page-title">Post a New Job</h1>
      <div className="card">
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input required value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g. Software Engineer" />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input required value={form.company} onChange={e => f('company', e.target.value)} placeholder="Your company" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input required value={form.location} onChange={e => f('location', e.target.value)} placeholder="Mumbai, Remote..." />
            </div>
            <div className="form-group">
              <label>Salary</label>
              <input value={form.salary} onChange={e => f('salary', e.target.value)} placeholder="₹5-8 LPA" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Job Type</label>
              <select value={form.type} onChange={e => f('type', e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => f('category', e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Experience Required</label>
            <select value={form.experience} onChange={e => f('experience', e.target.value)}>
              {EXP.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Job Description *</label>
            <textarea required rows={6} value={form.description} onChange={e => f('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and what you're looking for..." />
          </div>
          <div className="form-group">
            <label>Requirements (one per line)</label>
            <textarea rows={4} value={form.requirements} onChange={e => f('requirements', e.target.value)}
              placeholder="Bachelor's degree in Computer Science&#10;3+ years experience&#10;Strong communication skills" />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input value={form.skills} onChange={e => f('skills', e.target.value)}
              placeholder="React, Node.js, MongoDB, Git" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}
