import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';

const categories = ['IT', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'HR'];

export default function Home() {
  const [search,   setSearch]   = useState('');
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/jobs?limit=6').then(r => setFeatured(r.data.jobs)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>Find Your <span style={{ color: '#93c5fd' }}>Dream Job</span></h1>
        <p>Thousands of jobs from top companies. Your next opportunity is here.</p>
        <form className="hero-search" onSubmit={handleSearch}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs, skills, companies..."
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="hero-stats">
          <div className="hero-stat"><h3>10K+</h3><p>Active Jobs</p></div>
          <div className="hero-stat"><h3>5K+</h3><p>Companies</p></div>
          <div className="hero-stat"><h3>1M+</h3><p>Job Seekers</p></div>
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <h2 className="section-title text-center mb-2">Browse by Category</h2>
        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {categories.map(cat => (
            <div key={cat} className="card text-center" style={{ cursor: 'pointer', padding: '1rem' }}
              onClick={() => navigate(`/jobs?category=${cat}`)}>
              <div style={{ fontSize: '1.5rem', marginBottom: '.4rem' }}>
                {{ IT: '💻', Marketing: '📢', Finance: '💰', Healthcare: '🏥', Education: '📚', Design: '🎨', Sales: '📊', HR: '👥' }[cat]}
              </div>
              <div style={{ fontWeight: 600, fontSize: '.95rem' }}>{cat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container" style={{ paddingBottom: '3rem' }}>
        <h2 className="section-title">Latest Jobs</h2>
        {featured.length === 0
          ? <div className="empty-state"><h3>No jobs yet. Check back soon!</h3></div>
          : <div className="grid-2">{featured.map(j => <JobCard key={j._id} job={j} />)}</div>
        }
        <div className="text-center mt-3">
          <button className="btn btn-outline" onClick={() => navigate('/jobs')}>View All Jobs →</button>
        </div>
      </section>
    </div>
  );
}
