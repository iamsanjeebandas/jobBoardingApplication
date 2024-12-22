import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import jwt from "jsonwebtoken";
import { FaCheckCircle, FaClock, FaTimesCircle, FaBriefcase } from "react-icons/fa";

const GET_USER_APPLICATIONS = gql`
  query GetUserApplications($userId: ID!) {
    userApplications(userId: $userId) {
      id
      jobId {
        title
        company
      }
      status
      appliedTime
    }
  }
`;

const AppliedJobs = () => {
  const [userId, setUserId] = useState(null);

  // Extract user ID from the JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setUserId(decoded?.id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const { loading, error, data } = useQuery(GET_USER_APPLICATIONS, {
    variables: { userId },
    skip: !userId, // Skip the query if userId is not available
  });

  if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  if (!data || !data.userApplications || data.userApplications.length === 0) {
    return <p className="text-center text-gray-600">No applications found.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">Applied Jobs</h1>
      <div className="space-y-6">
        {data.userApplications.slice().reverse().map((application) => (
          <div
            key={application.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border rounded-lg shadow-sm p-5 bg-white hover:shadow-lg transition duration-300"
          >
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center mb-2">
                <FaBriefcase className="text-blue-500 mr-2" /> {application.jobId.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600">{application.jobId.company}</p>
              <p className="text-xs text-gray-400 mt-2">
                Applied on:{" "}
                {application.appliedTime
                  ? new Date(parseInt(application.appliedTime)).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                  : "Date not available"}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <p className={`text-sm md:text-base font-semibold flex items-center ${getStatusClass(application.status)}`}>
                {getStatusIcon(application.status)} {application.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get status class based on application status
const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "text-yellow-500";
    case "shortlisted":
      return "text-green-500";
    case "rejected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

// Helper function to get status icon
const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <FaClock className="mr-2" />;
    case "shortlisted":
      return <FaCheckCircle className="mr-2" />;
    case "rejected":
      return <FaTimesCircle className="mr-2" />;
    default:
      return null;
  }
};

export default AppliedJobs;
