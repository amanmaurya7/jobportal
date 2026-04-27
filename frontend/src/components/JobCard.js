import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  const timeAgo = (date) => {
    const d = Math.floor((Date.now() - new Date(date)) / 86400000);
    return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`;
  };

  return (
    <div className="card job-card">
      <div className="job-card-header">
        <div>
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.company || job.postedBy?.company || 'Company'}</div>
        </div>
        <span className="text-muted" style={{ fontSize: '.8rem', whiteSpace: 'nowrap' }}>
          {timeAgo(job.createdAt)}
        </span>
      </div>
      <div className="job-meta">
        <span className="badge badge-gray">📍 {job.location}</span>
        <span className="badge badge-blue">{job.type}</span>
        <span className="badge badge-green">💰 {job.salary}</span>
        {job.experience && <span className="badge badge-orange">⏱ {job.experience}</span>}
      </div>
      {job.skills?.length > 0 && (
        <div className="flex wrap gap-1 mt-1">
          {job.skills.slice(0, 4).map(s => (
            <span key={s} className="badge badge-gray" style={{ fontSize: '.75rem' }}>{s}</span>
          ))}
          {job.skills.length > 4 && <span className="text-muted" style={{ fontSize: '.78rem' }}>+{job.skills.length - 4} more</span>}
        </div>
      )}
      <div className="mt-2">
        <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">View Details →</Link>
      </div>
    </div>
  );
}
