import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import jwt from "jsonwebtoken";

const APPLY_TO_JOB = gql`
  mutation ApplyToJob($jobId: ID!, $input: ApplyInput!) {
    applyToJob(jobId: $jobId, input: $input) {
      id
      companyName
      status
      appliedTime
    }
  }
`;

const ApplyForm = ({ job, closeModal }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        yearsOfExperience: "",
        skills: "",
        currentJobTitle: "",
        expectedSalary: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [applyToJob] = useMutation(APPLY_TO_JOB);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const decodedToken = jwt.decode(token);
                const userId = decodedToken.id;

                const response = await fetch("http://localhost:5000/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: `
                            query getUserDetails($id: ID!) {
                                user(id: $id) {
                                    firstName
                                    lastName
                                    email
                                }
                            }
                        `,
                        variables: { id: userId },
                    }),
                });

                const data = await response.json();
                if (!data.errors) {
                    const user = data.data.user;
                    setFormData((prevData) => ({
                        ...prevData,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                    }));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserDetails();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!formData.phoneNumber.match(phoneRegex)) {
            newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
        }

        if (!formData.email.match(emailRegex)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.yearsOfExperience || formData.yearsOfExperience <= 0) {
            newErrors.yearsOfExperience = "Years of experience must be positive.";
        }

        if (!formData.expectedSalary || formData.expectedSalary <= 0) {
            newErrors.expectedSalary = "Expected salary must be positive.";
        }

        if (!formData.skills) {
            newErrors.skills = "Skills field cannot be empty.";
        }

        if (!formData.description) {
            newErrors.description = "Please add a message for the recruiter.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const isValid = validateForm();
        if (!isValid) return;
    
        const skillsArray = formData.skills.split(",").map((skill) => skill.trim());
    
        try {
            const token = localStorage.getItem("token");
            const decodedToken = jwt.decode(token);
            const userId = decodedToken?.id;
    
            if (!userId) {
                console.error("User is not authenticated.");
                return;
            }
    
            await applyToJob({
                variables: {
                    jobId: job.id,
                    input: {
                        ...formData,
                        yearsOfExperience: parseInt(formData.yearsOfExperience, 10),
                        expectedSalary: parseFloat(formData.expectedSalary),
                        skills: skillsArray,
                        appliedBy: userId,
                    },
                },
            });
            alert("Application submitted successfully!");
            closeModal();
            
            // Reload the page after form submission
            window.location.reload();
        } catch (error) {
            console.error("Error submitting application:", error.message);
        }
    };
    

    return (
        <div className="max-w-2xl mx-auto p-4 ">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Apply for {job.title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input Fields */}
                {[
                    { name: "firstName", placeholder: "First Name", readOnly: true },
                    { name: "lastName", placeholder: "Last Name", readOnly: true },
                    { name: "email", placeholder: "Email", readOnly: true, type: "email" },
                    { name: "phoneNumber", placeholder: "Phone Number", required: true },
                    { name: "yearsOfExperience", placeholder: "Years of Experience", type: "number", required: true },
                    { name: "skills", placeholder: "Skills (comma-separated)", required: true },
                    { name: "currentJobTitle", placeholder: "Current Job Title" },
                    { name: "expectedSalary", placeholder: "Expected Salary", type: "number", required: true },
                ].map(({ name, placeholder, readOnly, type, required }) => (
                    <div key={name}>
                        <input
                            name={name}
                            type={type || "text"}
                            placeholder={placeholder}
                            value={formData[name]}
                            onChange={handleChange}
                            readOnly={readOnly}
                            required={required}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
                    </div>
                ))}

                {/* Textarea */}
                <div>
                    <textarea
                        name="description"
                        placeholder="Message for Recruiter"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    ></textarea>
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default ApplyForm;
