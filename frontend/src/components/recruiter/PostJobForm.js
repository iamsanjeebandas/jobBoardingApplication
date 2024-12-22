import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { toast, ToastContainer } from 'react-toastify'; // Importing Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing default CSS for Toastify


const PostJobForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [company, setCompany] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();

    // Fetch the logged-in user's data
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const decodedToken = jwt.decode(token);
                const userId = decodedToken.id; // Extract user ID from token

                const response = await fetch('http://localhost:5000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: `
                            query getUserDetails($id: ID!) {
                                user(id: $id) {
                                    id
                                    username
                                    firstName
                                    lastName
                                    role
                                    company
                                }
                            }
                        `,
                        variables: {
                            id: userId,
                        },
                    }),
                });

                const data = await response.json();
                if (data.errors) {
                    console.error('Error fetching user data:', data.errors);
                } else {
                    const user = data.data.user;
                    setLoggedInUser(user);
                    setCompany(user.company); // Set company from logged-in user
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUserDetails();
    }, [navigate]);

    // Handle the job form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const jobData = {
            title,
            description,
            jobRole,
        };
    
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: `
                        mutation {
                            postJob(
                                title: "${title}", 
                                description: "${description}", 
                                jobRole: "${jobRole}", 
                                company: "${company}",
                                postedBy: "${loggedInUser.id}"
                            ) {
                                id
                                title
                                description
                                company
                            }
                        }
                    `,
                }),
            });
    
            const data = await response.json();
            if (data.errors) {
                console.error('Error posting job:', data.errors);
                toast.error('Error posting job, please try again.');
            } else {
                console.log('Job posted successfully:', data.data.postJob);
                toast.success('Job posted successfully!');
                // Optionally, you can navigate or clear the form after success
                setTitle('');
                setDescription('');
                setJobRole('');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Post a Job</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Job Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Job Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="jobRole" className="block text-gray-700 text-sm font-medium mb-2">Job Role</label>
                    <input
                        type="text"
                        id="jobRole"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="company" className="block text-gray-700 text-sm font-medium mb-2">Company</label>
                    <input
                        type="text"
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        disabled
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Post Job
                </button>
            </form>
    
            {/* Toast Container for displaying notifications */}
            <ToastContainer />
        </div>
    );
    
};

export default PostJobForm;
