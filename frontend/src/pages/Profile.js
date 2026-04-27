import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name:'', location:'', resume:'', skills:'', company:'', website:'' });
  const [msg,   setMsg]   = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/profile/me').then(({ data }) => setForm({
      name:     data.name     || '',
      location: data.location || '',
      resume:   data.resume   || '',
      skills:   (data.skills || []).join(', '),
      company:  data.company  || '',
      website:  data.website  || '',
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg(''); setError(''); setSaving(true);
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      await axios.put('/api/profile/me', payload);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const f = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="container page" style={{ maxWidth: 600 }}>
      <h1 className="page-title">My Profile</h1>
      <div className="card">
        <div style={{ display: 'flex', align: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</div>
            <div className="text-muted">{user?.email}</div>
            <span className="badge badge-blue" style={{ marginTop: '.25rem' }}>{user?.role}</span>
          </div>
        </div>
        {msg   && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={e => f('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={e => f('location', e.target.value)} placeholder="Mumbai, India" />
          </div>
          {user?.role === 'jobseeker' && <>
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input value={form.skills} onChange={e => f('skills', e.target.value)} placeholder="React, Python, SQL..." />
            </div>
            <div className="form-group">
              <label>Resume / Portfolio URL</label>
              <input value={form.resume} onChange={e => f('resume', e.target.value)} placeholder="https://your-portfolio.com" />
            </div>
          </>}
          {user?.role === 'employer' && <>
            <div className="form-group">
              <label>Company</label>
              <input value={form.company} onChange={e => f('company', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input value={form.website} onChange={e => f('website', e.target.value)} placeholder="https://yourcompany.com" />
            </div>
          </>}
          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
