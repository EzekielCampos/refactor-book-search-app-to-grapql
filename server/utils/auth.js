require("dotenv").config();
const jwt = require("jsonwebtoken");
// set token secret and expiration date
const secret = process.env.SECRET;
const expiration = "2h";
const { GraphQLError } = require('graphql');


module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // We split the token string into an array and return actual token
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
    try {
      // we call jwt.verify (token, secret, optional expiration time)
      // If token is valid it will return the object that is in the token
      // If it throws an errro we do not add a user property to the request 
      // object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // Create property for user and set it for the data from the token
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // return the request object so it can be passed to the resolver as `context`
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
