const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { authMiddleware } = require("./utils/auth");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");  // Import CORS
const { typeDefs, resolvers } = require("./Schemas");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

// This will create the Apollo server that includes the typedef and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

// CORS options for production and development
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? "https://refactor-book-search-app-to-grapql.onrender.com/" // Replace with your production frontend URL
    : "http://localhost:3000",  // Development frontend URL
  credentials: true,  // Allows cookies to be sent
};

// Start Apollo Server function
const startApolloServer = async () => {
  await server.start();

  // Middleware configurations
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
  
  // Use CORS middleware before graphql route
  app.use(cors(corsOptions));

  // GraphQL middleware with context for authentication
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // Fallback route for handling other requests
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });

  // Connect to MongoDB and start the server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the server
startApolloServer();
