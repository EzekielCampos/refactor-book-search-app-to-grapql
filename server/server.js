const express = require("express");
const { ApolloServer } = require("@apollo/server");
// This will help make the request to the typedef, resolvers, and
// authentication of the token
const { expressMiddleware } = require("@apollo/server/express4");
//This function authenticates the JWT token that was sent from the frontend
const { authMiddleware } = require("./utils/auth");
const cookieParser = require("cookie-parser");
const path = require("path");
const { typeDefs, resolvers } = require("./Schemas");

const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

// This will create the Apollo server that includes the typedef and resolvers
// to make the data request from the backend
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

// This function will start the Apollo server
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  // This endpoint will take the request and go to the typedef and resolvers to find the corresponding data
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
  // Start the mongo server
  db.once("open", () => {
    app.listen(
      PORT,
      () => console.log(`🌍 Now listening on localhost:${PORT}`),
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`)
    );
  });
};

// Call the async function to start the server
startApolloServer();
