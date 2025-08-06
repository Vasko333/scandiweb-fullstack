import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/', // Update to your deployed backend URL later
});
// https://scandiweb-fullstack.onrender.com/
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;