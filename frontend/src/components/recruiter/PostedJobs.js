import React, { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { FaBriefcase, FaBuilding, FaTrashAlt } from 'react-icons/fa';

// Define the GraphQL query to get jobs posted by a specific user
const GET_POSTED_JOBS = gql`
  query GetPostedJobs($userId: String!) {
    postedJobs(userId: $userId) {
      id
      title
      description
      jobRole
      company
    }
  }
`;

// Define the GraphQL mutation to delete a job
const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id) {
      id
      title
    }
  }
`;

const PostedJobs = ({ userId }) => {
  console.log("UserId passed to PostedJobs:", userId);

  const { loading, error, data, refetch } = useQuery(GET_POSTED_JOBS, {
    variables: { userId },
  });

  const [deleteJob] = useMutation(DELETE_JOB, {
    onCompleted: () => {
      refetch(); // Refresh the job list after deletion
    },
    onError: (err) => {
      console.error("Error deleting job:", err.message);
    },
  });

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob({ variables: { id: jobId } });
        alert("Job deleted successfully!");
      } catch (err) {
        alert("Error deleting job: " + err.message);
      }
    }
  };

  useEffect(() => {
    if (data) {
      console.log("Fetched Jobs Data:", data);
    }
  }, [data]);

  if (loading) {
    console.log("Loading data...");
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching data:", error.message);
    return (
      <div className="text-center py-10">
        <p className="text-lg text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-xl   mx-auto overflow-hidden">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Jobs You've Posted</h1>
      {data?.postedJobs?.length === 0 ? (
        <p className="text-center text-gray-500">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {data.postedJobs.slice().reverse().map((job) => (
            <div
              key={job.id}
              className="bg-white border p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <FaBriefcase className="text-indigo-500 text-2xl mr-3" />
                <h3 className="text-xl font-semibold text-gray-800 flex-grow">{job.title}</h3>
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  onClick={() => handleDelete(job.id)}
                  title="Delete Job"
                >
                  <FaTrashAlt />
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <FaBuilding className="text-gray-500 mr-2" />
                <span>{job.company}</span>
              </div>
              <hr className="my-3 border-gray-300" />
              <p className="font-medium text-lg text-gray-700 mb-2">{job.jobRole}</p>
              <p className="text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
