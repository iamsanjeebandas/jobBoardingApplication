import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FaHome, FaUser, FaBriefcase, FaClipboardList, FaSignOutAlt } from 'react-icons/fa'; // Importing Font Awesome icons
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import jwt from 'jsonwebtoken';

const GET_RECRUITER_PROFILE = gql`
  query GetRecruiterProfile($recruiterId: ID!) {
    findUser(id: $recruiterId) {
      firstName
      lastName
      profilePicture
    }
  }
`;
const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation(); // to track the current route
    const token = localStorage.getItem('token');

    const decodedToken = jwt.decode(token);
    const recruiterId = decodedToken.id; // Extract user ID from token
    console.log('Admin ID:', recruiterId);

    const { data } = useQuery(GET_RECRUITER_PROFILE, {
        variables: { recruiterId },
    });

    const handleLogout = () => {
        // Clear everything from localStorage
        localStorage.removeItem('token');
        // Redirect to the login page
        navigate('/login');
    };

    const profilePictureUrl = data?.findUser?.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRilQYfWqyoZ-o5jtuBuHYJh2Dj43Gh0i5NUt3z8RO69cUw_eXgfSuTivmGl72Dn0gnehM&usqp=CAU";
    console.log(data);

    const firstName = data?.findUser?.firstName || "";
    const lastName = data?.findUser?.lastName || "";
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-gray-300 p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-10">Admin Dashboard</h2>
                    <ul>
                        {/* <li>
                            <Link
                                to="/"
                                className={`flex items-center py-4 px-4 rounded ${location.pathname === "/recruiter-dashboard" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaHome className="mr-3" /> Home
                            </Link>
                        </li> */}
                        {/* <li>
                            <Link
                                to="/recruiter-dashboard/about-us"
                                className={`flex items-center py-4 px-4 rounded ${location.pathname === "/recruiter-dashboard/about-us" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaUser className="mr-3" /> About Us
                            </Link>
                        </li> */}
                        {/* <li>
                            <Link
                                to="/recruiter-dashboard/post-a-job"
                                className={`flex items-center py-4 px-4 rounded ${location.pathname === "/recruiter-dashboard/post-a-job" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaBriefcase className="mr-3" /> Post a Job
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                to="/admin-dashboard/all-posted-jobs"
                                className={`flex items-center py-4 px-4 rounded ${location.pathname === "/admin-dashboard/all-posted-jobs" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaClipboardList className="mr-3" /> All Posted Jobs
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/job-seekers"
                                className={`flex items-center py-4 px-4 rounded ${location.pathname === "/admin-dashboard/job-seekers" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaClipboardList className="mr-3" /> Job Seekers
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/job-recruiters"
                                className={`flex items-center py-4 px-4 rounded ${location.pathname === "/admin-dashboard/job-recruiters" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaClipboardList className="mr-3" /> Job Recruiters
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/profile"
                                className={`flex items-center py-4 px-4 rounded ${location.pathname === "/admin-dashboard/profile" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                            >
                                <FaUser className="mr-3" /> Profile
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Profile Picture and Name at the bottom */}
                <div className="mt-auto flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                    <img
                        src={profilePictureUrl}
                        alt="Profile"
                        className="w-12 h-12 object-cover rounded-full border-2 border-blue-500"
                    />
                    <div>
                        <div className="font-semibold text-white">{firstName} {lastName}</div>
                    </div>
                </div>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                >
                    <FaSignOutAlt className="mr-3 inline-block" /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto"> {/* Add overflow-y-auto here */}
                {/* Display admin Dashboard content or nested routes */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;
