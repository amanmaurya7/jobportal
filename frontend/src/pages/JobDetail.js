import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job,         setJob]         = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying,    setApplying]    = useState(false);
  const [applied,     setApplied]     = useState(false);
  const [msg,         setMsg]         = useState('');
  const [showApply,   setShowApply]   = useState(false);

  useEffect(() => {
    axios.get(`/api/jobs/${id}`).then(r => { setJob(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await axios.post(`/api/applications/${id}`, { coverLetter });
      setApplied(true); setMsg('Application submitted successfully!'); setShowApply(false);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error applying');
    } finally { setApplying(false); }
  };

  if (loading) return <div className="container page text-center text-muted">Loading...</div>;
  if (!job)    return <div className="container page text-center text-muted">Job not found.</div>;

  return (
    <div className="container page">
      <button className="btn btn-secondary btn-sm mb-2" onClick={() => navigate(-1)}>← Back</button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        <div className="card">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', marginBottom: '.5rem' }}>{job.title}</h1>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginBottom: '.75rem' }}>{job.company}</div>
          <div className="job-meta mb-2">
            <span className="badge badge-gray">📍 {job.location}</span>
            <span className="badge badge-blue">{job.type}</span>
            <span className="badge badge-green">💰 {job.salary}</span>
            <span className="badge badge-orange">⏱ {job.experience}</span>
            <span className="badge badge-gray">🏷 {job.category}</span>
          </div>
          <div className="divider" />
          <h3 className="section-title">Job Description</h3>
          <p style={{ color: '#475569', lineHeight: 1.8 }}>{job.description}</p>

          {job.requirements?.length > 0 && <>
            <h3 className="section-title mt-2">Requirements</h3>
            <ul style={{ color: '#475569', paddingLeft: '1.5rem', lineHeight: 2 }}>
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </>}

          {job.skills?.length > 0 && <>
            <h3 className="section-title mt-2">Required Skills</h3>
            <div className="flex wrap gap-1">
              {job.skills.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
            </div>
          </>}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 className="section-title">About the Company</h3>
            <p style={{ fontWeight: 600 }}>{job.postedBy?.company || job.company}</p>
            <p className="text-muted">{job.postedBy?.email}</p>
            {job.postedBy?.website && <a href={job.postedBy.website} target="_blank" rel="noreferrer" className="text-muted">{job.postedBy.website}</a>}
          </div>

          <div className="card">
            {applied ? (
              <div className="alert alert-success">✓ {msg}</div>
            ) : showApply ? (
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label>Cover Letter (optional)</label>
                  <textarea rows={5} value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you're a great fit..." />
                </div>
                {msg && <div className="alert alert-error">{msg}</div>}
                <button type="submit" className="btn btn-primary btn-full" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" className="btn btn-secondary btn-full mt-1" onClick={() => setShowApply(false)}>Cancel</button>
              </form>
            ) : user?.role === 'jobseeker' ? (
              <button className="btn btn-primary btn-full" onClick={() => setShowApply(true)}>Apply Now</button>
            ) : user?.role === 'employer' ? (
              <p className="text-muted text-center">Switch to a jobseeker account to apply.</p>
            ) : (
              <div>
                <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>Login to Apply</button>
                <p className="text-muted text-center mt-1">No account? <a href="/register" style={{ color: '#1e40af' }}>Sign up free</a></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
