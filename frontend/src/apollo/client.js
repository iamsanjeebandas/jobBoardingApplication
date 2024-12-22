import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create an HTTP link to your GraphQL server
const httpLink = createHttpLink({
    uri: 'http://localhost:5000', // Your GraphQL API URL
});

// Create an authLink to set the Authorization header with the token from localStorage
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    // If token exists, add it to the authorization header; otherwise, send an empty string
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Initialize the Apollo Client
const client = new ApolloClient({
    link: authLink.concat(httpLink), // Chain the authLink and httpLink together
    cache: new InMemoryCache(), // Use InMemoryCache to store query results
});

// Export the Apollo Client instance
export default client;
