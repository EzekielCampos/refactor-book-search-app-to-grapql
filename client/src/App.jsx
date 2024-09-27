import "./App.css";

// Apollo will hanlde all the request through the backend as well as sending the token
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet } from "react-router-dom";

// This is the endpoint that will be hit when requesting data from the backend
const httpLink = createHttpLink({
  uri: "/graphql",
});

// This will create the headers that will be sent along with the link 
// when making a request to the backend
const authLink = setContext((_, { headers }) => {
  // Get the token that is saved from the backend
  const token = localStorage.getItem("id_token");

  return {
    // In the headers we will spread out any headers that already exist
    // and include the authorization with the token id
    headers: {
      ...headers,
      // If the user is logged in it will send back the token id to be decoded 
      // if the user is not logged in it will send an empty string
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// The client will be used in the provider so that 
// when a query or mutation is requested it will 
// send it to the endpoint with the corresponding data
// for the request
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

import Navbar from "./components/Navbar";
function App() {
  return (
    // All components will be able to make request using this provider 
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
