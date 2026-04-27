import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function MyApplications() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/applications/my')
      .then(r => setApps(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = d => {
    const days = Math.floor((Date.now() - new Date(d)) / 86400000);
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
  };

  if (loading) return <div className="container page text-center text-muted">Loading...</div>;

  return (
    <div className="container page">
      <h1 className="page-title">My Applications</h1>
      {apps.length === 0 ? (
        <div className="empty-state card">
          <h3>No applications yet</h3>
          <p>Browse and apply to jobs to see them here.</p>
          <Link to="/jobs" className="btn btn-primary mt-2">Browse Jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {apps.map(a => (
            <div key={a._id} className="card">
              <div className="flex justify-between align-center">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{a.job?.title}</div>
                  <div className="text-muted">{a.job?.company} · {a.job?.location}</div>
                  <div className="flex gap-1 mt-1">
                    <span className="badge badge-blue">{a.job?.type}</span>
                    <span className="badge badge-green">{a.job?.salary}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge status-${a.status}`}>{a.status}</span>
                  <div className="text-muted mt-1" style={{ fontSize: '.8rem' }}>{timeAgo(a.createdAt)}</div>
                </div>
              </div>
              {a.coverLetter && (
                <div className="mt-2" style={{ padding: '.75rem', background: '#f8fafc', borderRadius: 8, fontSize: '.88rem', color: '#475569' }}>
                  <strong>Cover Letter:</strong> {a.coverLetter}
                </div>
              )}
              <div className="mt-2">
                <Link to={`/jobs/${a.job?._id}`} className="btn btn-secondary btn-sm">View Job</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
