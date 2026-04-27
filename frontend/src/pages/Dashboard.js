import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs,      setJobs]      = useState([]);
  const [apps,      setApps]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeJob, setActiveJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        if (user.role === 'employer') {
          const { data } = await axios.get('/api/jobs/employer/mine');
          setJobs(data);
        } else {
          const { data } = await axios.get('/api/applications/my');
          setApps(data);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [user]);

  const loadApplicants = async (jobId) => {
    setActiveJob(jobId);
    const { data } = await axios.get(`/api/applications/job/${jobId}`);
    setApplicants(data);
  };

  const updateStatus = async (appId, status) => {
    await axios.put(`/api/applications/${appId}/status`, { status });
    setApplicants(a => a.map(x => x._id === appId ? { ...x, status } : x));
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    await axios.delete(`/api/jobs/${jobId}`);
    setJobs(j => j.filter(x => x._id !== jobId));
  };

  if (loading) return <div className="container page text-center text-muted">Loading...</div>;

  // ── EMPLOYER DASHBOARD ──
  if (user.role === 'employer') return (
    <div className="container page">
      <div className="flex justify-between align-center mb-2">
        <h1 className="page-title" style={{ margin: 0 }}>Employer Dashboard</h1>
        <Link to="/post-job" className="btn btn-primary">+ Post New Job</Link>
      </div>

      <div className="grid-3 mb-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card text-center"><h2 style={{ fontSize: '2rem', color: '#1e40af' }}>{jobs.length}</h2><p className="text-muted">Jobs Posted</p></div>
        <div className="card text-center"><h2 style={{ fontSize: '2rem', color: '#16a34a' }}>{jobs.filter(j => j.isActive).length}</h2><p className="text-muted">Active Jobs</p></div>
        <div className="card text-center"><h2 style={{ fontSize: '2rem', color: '#d97706' }}>{applicants.length}</h2><p className="text-muted">Viewing Applicants</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <h2 className="section-title">Your Job Listings</h2>
          {jobs.length === 0 ? <div className="empty-state card"><h3>No jobs posted yet</h3></div> : jobs.map(j => (
            <div key={j._id} className="card mb-2">
              <div className="flex justify-between align-center">
                <div>
                  <div style={{ fontWeight: 600 }}>{j.title}</div>
                  <div className="text-muted">{j.location} · {j.type}</div>
                </div>
                <span className={`badge ${j.isActive ? 'badge-green' : 'badge-gray'}`}>{j.isActive ? 'Active' : 'Closed'}</span>
              </div>
              <div className="flex gap-1 mt-2">
                <button className="btn btn-secondary btn-sm" onClick={() => loadApplicants(j._id)}>View Applicants</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteJob(j._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="section-title">{activeJob ? 'Applicants' : 'Select a job to view applicants'}</h2>
          {activeJob && applicants.length === 0 && <div className="empty-state card"><h3>No applicants yet</h3></div>}
          {applicants.map(a => (
            <div key={a._id} className="card mb-2">
              <div style={{ fontWeight: 600 }}>{a.applicant?.name}</div>
              <div className="text-muted">{a.applicant?.email}</div>
              {a.applicant?.skills?.length > 0 && (
                <div className="flex wrap gap-1 mt-1">
                  {a.applicant.skills.slice(0, 3).map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                </div>
              )}
              {a.coverLetter && <p className="text-muted mt-1" style={{ fontSize: '.85rem' }}>"{a.coverLetter.slice(0, 100)}..."</p>}
              <div className="flex gap-1 mt-2 align-center">
                <span className={`badge status-${a.status}`}>{a.status}</span>
                <select value={a.status} onChange={e => updateStatus(a._id, e.target.value)}
                  style={{ fontSize: '.82rem', border: '1px solid #e2e8f0', borderRadius: 6, padding: '.25rem' }}>
                  {['Applied','Reviewed','Shortlisted','Rejected','Hired'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── JOBSEEKER DASHBOARD ──
  return (
    <div className="container page">
      <h1 className="page-title">Welcome, {user.name}!</h1>
      <div className="grid-3 mb-3">
        <div className="card text-center"><h2 style={{ fontSize: '2rem', color: '#1e40af' }}>{apps.length}</h2><p className="text-muted">Total Applications</p></div>
        <div className="card text-center"><h2 style={{ fontSize: '2rem', color: '#16a34a' }}>{apps.filter(a => a.status === 'Shortlisted').length}</h2><p className="text-muted">Shortlisted</p></div>
        <div className="card text-center"><h2 style={{ fontSize: '2rem', color: '#d97706' }}>{apps.filter(a => a.status === 'Hired').length}</h2><p className="text-muted">Offers Received</p></div>
      </div>
      <div className="flex justify-between align-center mb-2">
        <h2 className="section-title" style={{ margin: 0 }}>Recent Applications</h2>
        <Link to="/jobs" className="btn btn-outline btn-sm">Browse Jobs</Link>
      </div>
      {apps.length === 0 ? (
        <div className="empty-state card"><h3>No applications yet</h3><p>Start applying to jobs!</p><Link to="/jobs" className="btn btn-primary mt-2">Browse Jobs</Link></div>
      ) : apps.slice(0, 5).map(a => (
        <div key={a._id} className="card mb-2">
          <div className="flex justify-between align-center">
            <div>
              <div style={{ fontWeight: 600 }}>{a.job?.title}</div>
              <div className="text-muted">{a.job?.company} · {a.job?.location}</div>
            </div>
            <span className={`badge status-${a.status}`}>{a.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
