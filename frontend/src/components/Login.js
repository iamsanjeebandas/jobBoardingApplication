import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router';
import jwt from 'jsonwebtoken';

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const [login] = useMutation(LOGIN_MUTATION);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ variables: formData });
            console.log(data);

            localStorage.setItem('token', data.login); // Store JWT in localStorage
            alert('Login Successful!');
            console.log(data.login);
            

            // After login, check the user's role and navigate to the appropriate dashboard
            const userRole = jwt.decode(data.login).role; // Decode the JWT token to get user role
            console.log(userRole);
            

            if (userRole === 'seeker') {
                navigate('/seeker-dashboard'); // Redirect to Seeker Dashboard
            } else if (userRole === 'recruiter') {
                navigate('/recruiter-dashboard'); // Redirect to Recruiter Dashboard
            }
            else {
                navigate('/admin-dashboard');
            }
        } catch (err) {
            console.error(err.message);
            alert('Login Failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#95c0f8] to-[#ac9bf3] flex items-center justify-center p-6 bg-pattern">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
            >
                <h2 className="text-3xl font-bold text-center text-custom-blue">
                    Welcome Back
                </h2>
                <p className="text-gray-600 text-center">
                    Please login to continue
                </p>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-custom-blue focus:border-custom-blue"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-custom-blue focus:border-custom-blue"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-custom-blue text-white py-2 px-4 rounded-lg shadow hover:bg-custom-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-blue"
                >
                    Login
                </button>
                <p className="text-sm text-gray-600 text-center">
                    Don’t have an account?{' '}
                    <a href="/signup" className="text-custom-purple hover:underline">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
