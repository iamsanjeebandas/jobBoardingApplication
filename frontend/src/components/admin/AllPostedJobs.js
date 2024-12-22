import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { FaBriefcase, FaBuilding } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const GET_ALL_POSTED_JOBS = gql`
  query GetJobs {
    jobs {
      id
      title
      description
      company
      postedAt
    }
  }
`;

const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id) {
      id
    }
  }
`;

const AllPostedJobs = () => {
  const { loading: jobsLoading, error: jobsError, data: jobsData, refetch } = useQuery(GET_ALL_POSTED_JOBS);
  const [deleteJob] = useMutation(DELETE_JOB, {
    onCompleted: () => {
      refetch(); 
      toast.success("Job deleted successfully!");
    },
    onError: (err) => {
      console.error("Error deleting job:", err.message);
      toast.error("Error deleting job. Please try again.");
    },
  });

  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

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
  }, [jobsData, sortOrder, searchTerm]);

  if (jobsLoading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (jobsError) return <p className="text-center text-red-500">Error: {jobsError.message}</p>;

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      deleteJob({ variables: { id } });
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen ">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">All Jobs</h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-between items-center space-x-4">
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />

        {/* Sorting Controls */}
        <div>
          <label className="mr-2 text-gray-600">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Job Listings or No Results */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0 md:space-x-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                  <FaBriefcase className="text-blue-500 mr-2" /> {job.title}
                </h3>
                <p className="text-sm text-gray-600 flex items-center mb-3">
                  <FaBuilding className="mr-2 text-gray-500" /> {job.company}
                </p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                <p className="text-xs text-gray-400 flex items-center">
                  <FiClock className="mr-1" />
                  Posted on: {job.postedAt ? new Date(parseInt(job.postedAt)).toLocaleString() : "Date not available"}
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center text-gray-600 mt-10 space-y-6">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696458.jpg?t=st=1734767826~exp=1734771426~hmac=f553e06f9880d45d8db23e87dae1f5f48dc88f5c48d3e458771f339551c5870f&w=740"
            alt="No Results Found"
            className="w-40 h-40"
          />
          <p className="text-xl font-semibold">No Results Found</p>
          <p className="text-sm">We couldn’t find any jobs matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSortOrder("latest");
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default AllPostedJobs;
