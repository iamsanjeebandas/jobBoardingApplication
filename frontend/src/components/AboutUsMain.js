import React from "react";
import { Link } from 'react-router-dom';
import suitcase from "../../src/images/suitcase.png";

const AboutUs= () => {
  return (
    
    <div className="bg-gray-50">

      
 
      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">About Us</h1>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-custom-blue text-sm uppercase font-bold">About HireSphere</h2>
          <h3 className="text-3xl font-bold mt-2">
            Welcome to HireSphere – Your one-stop platform connecting talent with opportunities.
          </h3>
          <p className="mt-6 text-gray-700">
            At HireSphere, we believe that every individual has the potential to shine, and every company deserves the right talent to grow and innovate. Our mission is to bridge the gap between job seekers and recruiters through a seamless, efficient, and personalized hiring experience.
          </p>
          <button className="mt-8 bg-custom-blue text-white px-6 py-2 rounded">View Our Service</button>
        </div>
        <div>
          <img
            src="https://img.freepik.com/free-vector/teamwork-concept-landing-page_52683-20165.jpg?t=st=1734597130~exp=1734600730~hmac=f87b24befd397b1ce24c023aa156d3d862f51ab5e73a9be2c8b26661822a2461&w=740"
            alt="Team Collaboration"
            className="rounded-lg w-3/4 mx-auto"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-custom-blue text-sm uppercase font-bold text-center">Our Values</h2>
          <h3 className="text-3xl font-bold text-center mt-4">
            Our Vision & Mission for a Better Hiring Experience
          </h3>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Empowering Job Seekers", "Innovating Recruitment", "Building a Connected Future"].map(
              (value, index) => (
                <div key={index} className="bg-white p-8 shadow-md rounded-lg text-center">
                  <h4 className="text-xl font-bold text-custom-blue">{value}</h4>
                  <p className="mt-4 text-gray-700">
                    At HireSphere, we are dedicated to empowering job seekers, transforming recruitment practices, and connecting the workforce with opportunities that align with their goals.
                  </p>
                  <button className="mt-6 text-custom-blue font-bold">Read More →</button>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="https://img.freepik.com/free-vector/man-having-online-job-interview_52683-43379.jpg?t=st=1734596867~exp=1734600467~hmac=3557e60cd78036f1bd2aff5a89d048da3806462c0d118f1585e0f0a0ac8759be&w=740"
            alt="Team Collaboration"
            className="rounded-lg w-3/4 mx-auto"
          />
        </div>
        <div>
          <h2 className="text-custom-blue text-sm uppercase font-bold">Our Mission</h2>
          <h3 className="text-3xl font-bold mt-2">
            Empower job seekers, provide cutting-edge tools to recruiters, and enable administrators to oversee the platform with ease.
          </h3>
          <p className="mt-6 text-gray-500">
            We aim to revolutionize the hiring process by making it more accessible, transparent, and empowering for everyone involved. Our platform facilitates seamless connections between job seekers, recruiters, and administrators.
          </p>
          <ul className="mt-6 text-gray-500 list-disc ml-6">
            <li>Empower job seekers to showcase their skills and land their dream jobs effortlessly.</li>
            <li>Provide recruiters with tools to find the best-fit candidates for their roles.</li>
            <li>Enable administrators to manage the ecosystem with clarity and precision.</li>
          </ul>
          <button className="mt-8 bg-custom-blue text-white px-6 py-2 rounded">Join Our Platform</button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-900 text-white py-16 text-center">
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <p className="mt-4 text-sm">Got questions or suggestions? We’d love to hear from you.</p>
        <p className="mt-4">Email: <a href="mailto:contact@hiresphere.com" className="text-custom-blue">contact@hiresphere.com</a></p>
        <p className="mt-2">Website: <a href="https://www.hiresphere.com" className="text-custom-blue">www.hiresphere.com</a></p>
      </section>
    </div>
  );
};

export default AboutUs;
