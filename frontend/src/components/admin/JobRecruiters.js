import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";

export const TOGGLE_USER_ACTIVE_STATUS = gql`
  mutation ToggleUserActiveStatus($userId: ID!) {
    toggleUserActiveStatus(userId: $userId) {
      id
      isActive
    }
  }
`;

export const GET_ALL_RECRUITERS = gql`
  query GetAllRecruiters {
    getAllRecruiters {
      id
      email
      username
      firstName
      lastName
      phone
      profilePicture
      isActive
    }
  }
`;

const JobRecruiters = () => {
  const { loading, error, data } = useQuery(GET_ALL_RECRUITERS);
  const [toggleUserActiveStatus] = useMutation(TOGGLE_USER_ACTIVE_STATUS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserActiveStatus({ variables: { userId } });
      toast.success("User status updated successfully!");
    } catch (error) {
      toast.error(`Error toggling user status: ${error.message}`);
    }
  };

  const filteredRecruiters = data?.getAllRecruiters.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (loading) return <p className="text-center text-gray-500">Loading recruiters...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Hot Toast Notification Container */}
      <Toaster position="top-right" reverseOrder={false}/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">All Job Recruiters</h1>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name"
            className="w-full px-4 py-2 border rounded-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* No recruiters found */}
        {filteredRecruiters?.length === 0 && searchQuery && (
          <div className="text-center text-gray-500 mt-4">
            <p>No recruiters found matching "{searchQuery}".</p>
          </div>
        )}

        {/* Display Recruiters Table */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecruiters?.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <img
                      src={user.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRilQYfWqyoZ-o5jtuBuHYJh2Dj43Gh0i5NUt3z8RO69cUw_eXgfSuTivmGl72Dn0gnehM&usqp=CAU"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.isActive ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg ${
                        user.isActive ? "bg-red-600 text-white" : "bg-green-600 text-white"
                      } hover:bg-opacity-80`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Recruiters Case */}
        {filteredRecruiters?.length === 0 && !searchQuery && (
          <div className="flex flex-col items-center text-center mt-10">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRilQYfWqyoZ-o5jtuBuHYJh2Dj43Gh0i5NUt3z8RO69cUw_eXgfSuTivmGl72Dn0gnehM&usqp=CAU"
              alt="No Recruiters"
              className="w-40 h-40"
            />
            <p className="text-xl font-semibold text-gray-600">No Recruiters Found</p>
            <p className="text-sm text-gray-500">No users with the role of "recruiter" are available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecruiters;
