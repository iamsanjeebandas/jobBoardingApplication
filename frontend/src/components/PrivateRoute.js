import React from 'react';
import { Navigate } from 'react-router';
import { useQuery, gql } from '@apollo/client';

const GET_USER_DATA = gql`
    query GetUserData {
        getUserData {
            role
        }
    }
`;

const PrivateRoute = ({ allowedRoles, children }) => {
    const { data, loading, error } = useQuery(GET_USER_DATA);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // If the user is not authenticated or doesn't have the required role, redirect to login
    if (!data || !allowedRoles.includes(data.getUserData.role)) {
        return <Navigate to="/login" />;
    }

    return children;  // If role matches, render the component
};

export default PrivateRoute;
