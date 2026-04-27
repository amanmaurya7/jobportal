import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '', role: 'jobseeker', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container page" style={{ maxWidth: 480, paddingTop: '3rem' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '.25rem' }}>Create Account</h1>
        <p className="text-muted mb-2">Join thousands of job seekers and employers</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" />
          </div>
          <div className="form-group">
            <label>I am a...</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer / Recruiter</option>
            </select>
          </div>
          {form.role === 'employer' && (
            <div className="form-group">
              <label>Company Name</label>
              <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Your company name" />
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-2 text-muted">
          Already have an account? <Link to="/login" style={{ color: '#1e40af' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
