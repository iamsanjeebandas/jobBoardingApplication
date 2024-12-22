import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import jwt from "jsonwebtoken";
import { toast, Toaster } from "react-hot-toast";

// GraphQL queries and mutation
const GET_RECRUITER_PROFILE = gql`
  query GetRecruiterProfile($recruiterId: ID!) {
    findUser(id: $recruiterId) {
      firstName
      lastName
      email
      username
      company
      profilePicture
    }
  }
`;

const UPDATE_PROFILE_PICTURE = gql`
  mutation UpdateProfilePicture($id: ID!, $profilePicture: String!) {
    updateProfilePicture(id: $id, profilePicture: $profilePicture) {
      id
      profilePicture
    }
  }
`;

const UPDATE_RECRUITER_PROFILE = gql`
  mutation UpdateRecruiterProfile($id: ID!, $firstName: String, $lastName: String, $email: String, $username: String) {
    updateRecruiterProfile(id: $id, firstName: $firstName, lastName: $lastName, email: $email, username: $username) {
      firstName
      lastName
      email
      username
    }
  }
`;

const REMOVE_PROFILE_PICTURE = gql`
  mutation RemoveProfilePicture($id: ID!) {
    removeProfilePicture(id: $id) {
      id
      profilePicture
    }
  }
`;

 

const RecruiterProfile = () => {
    const [recruiterId, setRecruiterId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    // Decode the JWT token to get the recruiter ID
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwt.decode(token);
                setRecruiterId(decoded?.id);
            } catch (err) {
                console.error("Error decoding token:", err);
            }
        }
    }, []);

    // Fetch recruiter profile data
    const { loading, error, data } = useQuery(GET_RECRUITER_PROFILE, {
        variables: { recruiterId },
        skip: !recruiterId, // Skip the query until recruiterId is available
    });

    // Mutation to update profile picture
    const [updateProfilePicture] = useMutation(UPDATE_PROFILE_PICTURE);
    const [removeProfilePicture] = useMutation(REMOVE_PROFILE_PICTURE);

    // Mutation to update recruiter profile details
    const [updateRecruiterProfile] = useMutation(UPDATE_RECRUITER_PROFILE);

    useEffect(() => {
        if (data?.findUser) {
            const profile = data.findUser;
            setFirstName(profile.firstName);
            setLastName(profile.lastName);
            setEmail(profile.email);
            setUsername(profile.username);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const profile = data?.findUser;
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRilQYfWqyoZ-o5jtuBuHYJh2Dj43Gh0i5NUt3z8RO69cUw_eXgfSuTivmGl72Dn0gnehM&usqp=CAU"; // Placeholder for missing profile pictures

    const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const maxSize = 5 * 1024 * 1024;  // 5MB limit
                if (file.size > maxSize) {
                    toast.error("File is too large! Please select a file smaller than 5MB.");
                    return;
                }
    
                setSelectedImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageUrl(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };

    const handleProfilePictureUpload = () => {
        if (imageUrl && recruiterId) {
            updateProfilePicture({ variables: { id: recruiterId, profilePicture: imageUrl } })
                .then((response) => {
                    console.log("Profile picture updated:", response);
                    setUploadSuccess(true);
                    setTimeout(() => {
                        setUploadSuccess(false);
                        window.location.reload();
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Error updating profile picture:", error);
                });
        }
    };

    const handleCancelImage = () => {
        setSelectedImage(null);
        setImageUrl("");
    };

    const handleUpdateProfile = () => {
           if (recruiterId) {
               updateRecruiterProfile({
                   variables: { id: recruiterId, firstName, lastName, email, username }
               })
                   .then(response => {
                       console.log("Profile updated:", response);
                       toast.success("Profile updated successfully!");
                   })
                   .catch(error => {
                       console.error("Error updating profile:", error);
                       toast.error("Error updating profile.");
                   });
           }
       };

       const handleRemoveProfilePicture = () => {
        if (recruiterId) {
          removeProfilePicture({ variables: { id: recruiterId } })
            .then((response) => {
              console.log("Profile picture removed:", response);
              toast.success("Profile picture removed successfully!");
            })
            .catch((error) => {
              console.error("Error removing profile picture:", error);
              toast.error("Error removing profile picture.");
            });
        }
      };

    const profilePictureUrl = profile?.profilePicture || defaultImage;

    return (
        <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-xl space-y-6">
              <Toaster
              
              position="top-right"
              reverseOrder={false}/>
            {profile ? (
                <div className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex justify-center items-center flex-col relative">
                        {/* Profile Picture */}
                        <div className="relative">
                            <img
                                src={profilePictureUrl}
                                alt="Profile"
                                className="w-36 h-36 object-cover rounded-full border-4 border-blue-500 transition-all duration-300 hover:scale-105"
                            />
                            {/* Edit Icon */}
                            <label
                                htmlFor="profilePic"
                                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M15 12h3l-4 4-4-4h3V3h2v9z"></path>
                                </svg>
                            </label>
                            <input
                                type="file"
                                id="profilePic"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        {/* Image Preview and Upload/Cancel */}
                        {selectedImage && (
                            <div className="mt-4 space-x-4">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-full border-4 "
                                />
                                <div className="mt-2">
                                    <button
                                        onClick={handleProfilePictureUpload}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-full"
                                    >
                                        Upload
                                    </button>
                                    <button
                                        onClick={handleCancelImage}
                                        className="bg-gray-400 text-white px-4 py-2 rounded-full ml-4"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}


                             {/* Remove Profile Picture */}
                {!selectedImage && profilePictureUrl !== defaultImage && (
                  <button
                    onClick={handleRemoveProfilePicture}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full"
                  >
                    Remove Profile Picture
                  </button>
                )}
                    </div>

                    {/* Profile Details Section */}
                    <div className="space-y-6">
                        {/* User Information Card */}
                        <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 hover:shadow-[4px_8px_10px_rgba(219,_234,_255,_0.7)] transition duration-300">
                            <div className="flex items-center space-x-4">
                                <div className="text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 3l5 5-11 11H3v-5L16 3z"></path>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-lg text-blue-800">
                                        {profile.firstName} {profile.lastName}
                                    </div>
                                    <div className="text-gray-600">{profile.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Editable User Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="p-4 bg-white rounded-lg  hover:shadow-[4px_8px_10px_rgba(219,_234,_255,_0.7)] transition-all">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-400">First Name:</span>
                                </div>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full p-2 mt-1 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                    />
                            </div>

                            {/* Last Name */}
                            <div className="p-4 bg-white rounded-lg  hover:shadow-[4px_8px_10px_rgba(219,_234,_255,_0.7)] transition-all">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-400">Last Name:</span>
                                </div>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full p-2 mt-1 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="p-4 bg-white rounded-lg hover:shadow-[4px_8px_10px_rgba(219,_234,_255,_0.7)] transition-all">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-400">Email:</span>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 mt-1 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                />
                        </div>

                        {/* Username */}
                        <div className="p-4 bg-white rounded-lg hover:shadow-[4px_8px_10px_rgba(219,_234,_255,_0.7)] transition-all">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-400">Username:</span>
                            </div>
                            
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 mt-1 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                />
                                
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleUpdateProfile}
                            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <p>No profile data found.</p>
            )}
        </div>
    );
};

export default RecruiterProfile;
