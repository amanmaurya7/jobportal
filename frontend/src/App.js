import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Jobs        from './pages/Jobs';
import JobDetail   from './pages/JobDetail';
import Dashboard   from './pages/Dashboard';
import PostJob     from './pages/PostJob';
import Profile     from './pages/Profile';
import MyApplications from './pages/MyApplications';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-3">Loading...</div>;
  if (!user)   return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/jobs"       element={<Jobs />} />
        <Route path="/jobs/:id"   element={<JobDetail />} />
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/post-job"   element={<PrivateRoute role="employer"><PostJob /></PrivateRoute>} />
        <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/my-applications" element={<PrivateRoute role="jobseeker"><MyApplications /></PrivateRoute>} />
        <Route path="*"           element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
