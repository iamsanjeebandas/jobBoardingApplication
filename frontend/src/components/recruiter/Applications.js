import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify"; // Importing react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default CSS for toast notifications

const GET_RECRUITER_APPLICATIONS = gql`
  query GetRecruiterApplications($recruiterId: ID!) {
    applicationsByRecruiter(recruiterId: $recruiterId) {
      id
      firstName
      lastName
      email
      phoneNumber
      yearsOfExperience
      skills
      currentJobTitle
      expectedSalary
      description
      jobId {
        title
        company
      }
      status
      appliedTime
    }
  }
`;

const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($applicationId: ID!, $status: String!, $recruiterId: ID!) {
    updateApplicationStatus(applicationId: $applicationId, status: $status, recruiterId: $recruiterId) {
      id
      status
    }
  }
`;

const Applications = () => {
  const [recruiterId, setRecruiterId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setRecruiterId(decoded?.id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const { loading, error, data } = useQuery(GET_RECRUITER_APPLICATIONS, {
    variables: { recruiterId },
  });

  const [updateApplicationStatus] = useMutation(UPDATE_APPLICATION_STATUS);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus({
        variables: { applicationId, status, recruiterId },
      });

      // Add a toast notification on success
      toast.success(`Application status updated to ${status}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.error("Error updating application status:", err);

      // Add a toast notification on error
      toast.error("Error updating application status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Job Applications</h1>
      {data.applicationsByRecruiter.length === 0 ? (
        <p className="text-center text-gray-500">No applications found.</p>
      ) : (
        data.applicationsByRecruiter.slice().reverse().map((application) => (
          <div
            key={application.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            {/* Header Section */}
            <div className="flex justify-between items-center p-6 bg-gray-50 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{application.jobId?.title}</h2>
                <p className="text-gray-500">{application.jobId?.company}</p>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(application.status)}`}
              >
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>

            {/* Body Section */}
            <div className="p-6 text-gray-700">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <span className="font-semibold">Name:</span> {application.firstName} {application.lastName}
                </div>
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href={`mailto:${application.email}`}
                    className="text-blue-500 hover:underline"
                  >
                    {application.email}
                  </a>
                </div>
                <div>
                  <span className="font-semibold">Phone:</span> {application.phoneNumber}
                </div>
                <div>
                  <span className="font-semibold">Experience:</span> {application.yearsOfExperience} years
                </div>
                <div>
                  <span className="font-semibold">Current Title:</span> {application.currentJobTitle}
                </div>
                <div>
                  <span className="font-semibold">Expected Salary:</span> Rs{application.expectedSalary}/-
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Skills:</span> {application.skills.join(", ")}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Applied On:</span>{" "}
                  {new Date(parseInt(application.appliedTime)).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Message:</span>
                  <div className="bg-gray-100 p-4 rounded-lg mt-2 text-gray-600 border-l-4 border-blue-500 shadow-sm">
                    {application.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {application.status === "pending" && (
              <div className="p-4 bg-gray-50 flex gap-4 justify-end border-t border-gray-200">
                <button
                  onClick={() => handleUpdateStatus(application.id, "shortlisted")}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdateStatus(application.id, "rejected")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
      <ToastContainer /> {/* ToastContainer component to display notifications */}
    </div>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "shortlisted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default Applications;
