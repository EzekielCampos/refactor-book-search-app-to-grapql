import "./App.css";

// Apollo will hanlde all the request through the backend as well as sending the token
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { Outlet } from "react-router-dom";
import { GlobalStateProvider } from "./utils/GlobalState";
const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://refactor-book-search-app-to-grapql.onrender.com/graphql" // Production backend URL
      : "/graphql", // Dev server will proxy this to your local backend
  credentials: "include", // Ensure cookies are included
});

// The client will be used in the provider so that
// when a query or mutation is requested it will
// send it to the endpoint with the corresponding data
// for the request
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

import Navbar from "./components/Navbar";
function App() {
  return (
    // All components will be able to make request using this provider
    <ApolloProvider client={client}>
      <GlobalStateProvider>
        {" "}
        <Navbar />
        <Outlet />
      </GlobalStateProvider>
    </ApolloProvider>
  );
}

export default App;
