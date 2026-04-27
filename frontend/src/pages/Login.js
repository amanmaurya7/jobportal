import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container page" style={{ maxWidth: 420, paddingTop: '4rem' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '.25rem' }}>Welcome back</h1>
        <p className="text-muted mb-2">Login to your JobConnect account</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} required
              onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} required
              onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-2 text-muted">
          Don't have an account? <Link to="/register" style={{ color: '#1e40af' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
