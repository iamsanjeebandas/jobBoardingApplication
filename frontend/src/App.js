import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import AboutUsMain from './components/AboutUsMain';
import SeekerDashboard from './components/SeekerDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import jwt from 'jsonwebtoken';
import AboutUs from './components/recruiter/AboutUs';
import PostJobForm from './components/recruiter/PostJobForm';
import AboutUsSeeker from './components/seeker/AboutUsSeeker';
import PostedJobs from './components/recruiter/PostedJobs';
import Jobs from './components/seeker/Jobs';
import AppliedJobs from './components/seeker/AppliedJobs';
import Applications from './components/recruiter/Applications';
import RecruiterProfile from './components/recruiter/RecruiterProfile';
import SeekerProfile from './components/seeker/SeekerProfile';
import AdminDashboard from './components/AminDashboard';
import AllPostedJobs from './components/admin/AllPostedJobs';
import JobSeekers from './components/admin/JobSeekers';
import JobRecruiters from './components/admin/JobRecruiters';
import AdminProfile from './components/admin/AdminProfile';

function App() {
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState(''); // State to store the userId
  const [loading, setLoading] = useState(true); // Track loading state to avoid early redirects
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.decode(token);
      setRole(decodedToken?.role);
      setUserId(decodedToken?.id); // Extract userId from the token
    }
    setLoading(false); // Once token check is done, stop loading
  }, []);

  useEffect(() => {
    // Redirect unauthenticated users trying to access protected routes
    if (!loading) {
      if (!role && (window.location.pathname === '/seeker-dashboard' || window.location.pathname === '/recruiter-dashboard')) {
        navigate('/'); // Redirect to home if no role found
      }
    }
  }, [role, loading, navigate]);

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUsMain />} />

        

        {/* Protected Routes */}
        <Route
          path="/seeker-dashboard"
          element={role === 'seeker' ? <SeekerDashboard userId={userId} /> : <Login />}
        />
          <Route path="/seeker-dashboard" element={<SeekerDashboard userId={userId} />}>
          <Route path="about-us" element={<AboutUsSeeker />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applied-jobs" element={<AppliedJobs userId={userId} />} />
          <Route path="profile" element={<SeekerProfile />} />
        </Route>

     
        <Route
          path="/admin-dashboard"
          element={role === 'admin' ? <AdminDashboard userId={userId} /> : <Login />}
        />
          <Route path="/admin-dashboard" element={<AdminDashboard userId={userId} />}>
          <Route path="all-posted-jobs" element={<AllPostedJobs />} />
          <Route path="job-seekers" element={<JobSeekers  />} />
          <Route path="job-recruiters" element={<JobRecruiters />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>


        <Route
          path="/recruiter-dashboard"
          element={role === 'recruiter' ? <RecruiterDashboard userId={userId} /> : <Login />}
        />
        
        {/* Recruiter-specific Routes */}
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard userId={userId} />}>
          <Route path="about-us" element={<AboutUs />} />
          <Route path="post-a-job" element={<PostJobForm />} />
          <Route path="posted-jobs" element={<PostedJobs userId={userId} />} /> {/* Pass userId here */}
          <Route path="applications" element={<Applications />} />
          <Route path="profile" element={<RecruiterProfile />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
