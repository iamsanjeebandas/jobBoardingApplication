import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import jwt from "jsonwebtoken";
import { FaBriefcase, FaBuilding } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import ApplyModal from "./ApplyModal";

const GET_JOBS = gql`
  query GetJobs {
    jobs {
      id
      title
      description
      company
      postedBy{
        id
        firstName
        lastName
      }
      postedAt
    }
  }
`;

const GET_USER_APPLICATIONS = gql`
  query GetUserApplications($userId: ID!) {
    userApplications(userId: $userId) {
      id
      jobId {
        id
      }
      status
    }
  }
`;

const FIND_USER = gql`
  query FindUser($id: ID!) {
    findUser(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

const Jobs = () => {
  const { loading: jobsLoading, error: jobsError, data: jobsData } = useQuery(GET_JOBS);

  const [applicationStatus, setApplicationStatus] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState(""); // For filtering
  const [filteredJobs, setFilteredJobs] = useState([]);

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

  const { loading: userLoading, error: userError, data: userData } = useQuery(FIND_USER, {
    variables: { id: jobsData?.jobs[0]?.postedBy },
  });

  useEffect(() => {
    if (!userLoading && !userError && userData) {
      const fullName = `${userData.findUser.firstName} ${userData.findUser.lastName}`;
      console.log(fullName);

      setFullName(fullName);
    }
  }, [userLoading, userError, userData]);

  const { loading: appsLoading, error: appsError, data: appsData } = useQuery(GET_USER_APPLICATIONS, {
    variables: { userId },
    skip: !userId,
    onCompleted: (data) => {
      const statusMap = {};
      data.userApplications.forEach((app) => {
        statusMap[app.jobId.id] = app.status;
      });
      setApplicationStatus(statusMap);
    },
  });

  const openApplyModal = (job) => setSelectedJob(job);
  const closeApplyModal = () => setSelectedJob(null);

  const sortedJobs = () => {
    if (!jobsData?.jobs) return [];
    return [...jobsData.jobs].sort((a, b) => {
      if (sortOrder === "latest") {
        return parseInt(b.postedAt) - parseInt(a.postedAt);
      } else {
        return parseInt(a.postedAt) - parseInt(b.postedAt);
      }
    });
  };

  useEffect(() => {
    const jobs = sortedJobs();
    if (searchTerm) {
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredJobs(jobs);
    }
  }, [jobsData, sortOrder, searchTerm]); // Update filter whenever jobs or searchTerm changes

  if (jobsLoading || appsLoading)
    return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (jobsError || appsError)
    return (
      <p className="text-center text-red-500">
        Error: {jobsError?.message || appsError?.message}
      </p>
    );

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Available Jobs</h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-3 py-1 mr-4"
        />

        {/* Sorting Controls */}
        <div>
          <label className="mr-2 text-gray-600">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                <FaBriefcase className="text-blue-500 mr-2" /> {job.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 flex items-center mb-3">
                <FaBuilding className="mr-2 text-gray-500" /> {job.company}
              </p>
              <p className="text-sm md:text-base text-gray-700 mb-4 line-clamp-2 md:line-clamp-3">
                {job.description}
              </p>
              <p className="text-sm md:text-base text-green-500 italic mb-2">
                Posted by: {job.postedBy ? `${job.postedBy.firstName} ${job.postedBy.lastName}` : "N/A"}
              </p>

              <p className="text-xs md:text-sm text-gray-400 flex items-center mb-10">
                <FiClock className="mr-1" />
                Posted on:{" "}
                {job.postedAt
                  ? new Date(parseInt(job.postedAt)).toLocaleString("en-US", {
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
              <button
                onClick={() => openApplyModal(job)}
                className={`w-full py-2 text-sm md:text-base rounded-md font-semibold text-white ${applicationStatus[job.id]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-custom-blue hover:bg-custom-purple transition duration-200"
                  }`}
                disabled={applicationStatus[job.id]}
              >
                {applicationStatus[job.id] || "Apply"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && <ApplyModal job={selectedJob} closeModal={closeApplyModal} />}
    </div>
  );
};

export default Jobs;
