import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';

const JOB_TYPES = ['', 'Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
const CATEGORIES = ['', 'IT', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'HR'];

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs,     setJobs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [pages,    setPages]    = useState(1);
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const [search,   setSearch]   = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState('');
  const [type,     setType]     = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const fetchJobs = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 8 });
      if (search)   params.set('search',   search);
      if (location) params.set('location', location);
      if (type)     params.set('type',     type);
      if (category) params.set('category', category);
      const { data } = await axios.get(`/api/jobs?${params}`);
      setJobs(data.jobs); setPages(data.pages); setTotal(data.total); setPage(p);
    } catch { setJobs([]); }
    finally  { setLoading(false); }
  }, [search, location, type, category]);

  useEffect(() => { fetchJobs(1); }, [category]);

  const handleSearch = (e) => { e.preventDefault(); fetchJobs(1); };

  return (
    <div className="container page">
      <form onSubmit={handleSearch} className="card mb-2" style={{ padding: '1rem' }}>
        <div className="flex gap-1 align-center wrap">
          <input className="form-group" style={{ flex: 1, padding: '.6rem .9rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontFamily: 'inherit', fontSize: '.95rem' }}
            value={search} onChange={e => setSearch(e.target.value)} placeholder="Search job title, skills..." />
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); setLocation(''); setType(''); setCategory(''); fetchJobs(1); }}>Clear</button>
        </div>
      </form>

      <div className="jobs-layout">
        {/* Filters sidebar */}
        <aside className="card sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Remote..." />
          </div>
          <div className="filter-group">
            <label>Job Type</label>
            <select value={type} onChange={e => { setType(e.target.value); fetchJobs(1); }}>
              {JOB_TYPES.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Category</label>
            <select value={category} onChange={e => { setCategory(e.target.value); fetchJobs(1); }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
            </select>
          </div>
          <button className="btn btn-secondary btn-full btn-sm" onClick={() => fetchJobs(1)}>Apply Filters</button>
        </aside>

        {/* Results */}
        <div>
          <div className="flex justify-between align-center mb-2">
            <span className="text-muted">{total} job{total !== 1 ? 's' : ''} found</span>
          </div>
          {loading ? (
            <div className="text-center mt-3 text-muted">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state card"><h3>No jobs found</h3><p>Try adjusting your filters.</p></div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs.map(j => <JobCard key={j._id} job={j} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  <button disabled={page <= 1}  onClick={() => fetchJobs(page - 1)}>← Prev</button>
                  {Array.from({ length: pages }, (_, i) => (
                    <button key={i+1} className={page === i+1 ? 'active' : ''} onClick={() => fetchJobs(i+1)}>{i+1}</button>
                  ))}
                  <button disabled={page >= pages} onClick={() => fetchJobs(page + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
