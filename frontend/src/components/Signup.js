import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router';

const SIGNUP_MUTATION = gql`
    mutation Register($email: String!, $username: String!, $firstName: String!, $lastName: String!, $password: String!, $role: String!, $company: String) {
        register(email: $email, username: $username, firstName: $firstName, lastName: $lastName, password: $password, role: $role, company: $company) {
            id
            email
        }
    }
`;

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'seeker', // Default role
        company: '',
    });

    const [register] = useMutation(SIGNUP_MUTATION);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ variables: formData });
            alert('Registration Successful!');
            navigate('/login'); // Redirect to Login
        } catch (err) {
            console.error(err.message);
            alert('Registration Failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#95c0f8] to-[#ac9bf3] flex items-center justify-center p-6 bg-pattern">
            <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center text-custom-blue">
                   Create an Account
                </h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                >
                    <option value="seeker">Job Seeker</option>
                    <option value="recruiter">Job Recruiter</option>
                </select>
                {formData.role === 'recruiter' && (
                    <input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                        required
                    />
                )}
                <button
                    type="submit"
                    className="w-full bg-custom-blue text-white py-2 px-4 rounded-lg shadow hover:bg-custom-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-blue"
                >
                    Sign Up
                </button>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-custom-purple hover:underline">
                        Log in
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
