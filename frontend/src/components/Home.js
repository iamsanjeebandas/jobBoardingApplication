import React from 'react';
import { Link } from 'react-router-dom';
import suitcase from "../../src/images/suitcase.png";

function Home() {
    return (
        <>
            {/* Navigation Bar */}
            <nav className="bg-transparent absolute top-0 left-0 w-full flex justify-between items-center px-10 py-4 z-20">
                {/* Logo Section */}
                <div className="flex items-center">
                    <img
                        src={suitcase}
                        alt="Logo"
                        className="h-8 w-8 mr-4" // Smaller logo size
                    />
                    <span className="text-white text-xl font-bold tracking-wide">HireSphere</span> {/* Smaller text for the title */}
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-8"> {/* Increased space between items */}
                    <Link to="/" className="text-white text-sm font-medium hover:underline">Home</Link> {/* Smaller text */}
                    <Link to="/about" className="text-white text-sm font-medium hover:underline">About Us</Link> {/* Smaller text */}
                    <Link to="/contact" className="text-white text-sm font-medium hover:underline">Contact Us</Link> {/* Smaller text */}

                    {/* Log In Button */}
                    <Link
                        to="/login"
                        className="text-white border-2 border-white py-2 px-6 rounded-md hover:bg-white hover:text-blue-500 transition duration-300 text-sm"
                    >
                        Log In
                    </Link>

                    {/* Sign Up Button */}
                    <Link
                        to="/signup"
                        className="bg-blue-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-400 transition duration-300 text-sm"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Menu Button (Hamburger) */}
                <div className="md:hidden flex items-center space-x-6"> {/* Increased space for mobile */}
                    <button className="text-white focus:outline-none">
                        <i className="fas fa-bars"></i> {/* You can replace this with an actual hamburger icon */}
                    </button>
                </div>
            </nav>

            {/* Background Section */}
            <div
                className="relative min-h-screen flex items-center justify-center p-6"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(79, 130, 246, 0.8), rgba(168, 85, 247, 0.8)), 
                        url('https://images.pexels.com/photos/7709123/pexels-photo-7709123.jpeg?auto=compress&cs=tinysrgb&w=600')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="text-center z-10">
                    <h4 className="text-4xl text-white font-bold mb-4 drop-shadow-md">
                        Welcome to the Job Boarding Application!
                    </h4>
                    <p className="text-md mb-8 max-w-2xl mx-auto leading-relaxed text-gray-300">
                        Find your next career opportunity or recruit the best talent with ease and efficiency.
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-center gap-6">
                        {/* Log In Button */}
                        <Link
                            to="/login"
                            className="text-white border-2 border-white py-2 px-6 rounded-md hover:bg-white hover:text-blue-500 transition duration-300 text-sm"
                        >
                            Log In
                        </Link>

                        {/* Sign Up Button */}
                        <Link
                            to="/signup"
                            className="bg-white text-custom-blue py-2 px-6 rounded-md font-semibold hover:bg-blue-400 transition duration-300 text-sm"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>

                {/* Overlay for Better Contrast */}
                <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            </div>
        </>
    );
}

export default Home;
