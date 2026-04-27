import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Job<span>Connect</span></Link>
      <div className="navbar-links">
        <Link to="/jobs">Browse Jobs</Link>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary btn">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'employer'  && <Link to="/post-job">Post Job</Link>}
            {user.role === 'jobseeker' && <Link to="/my-applications">My Applications</Link>}
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
