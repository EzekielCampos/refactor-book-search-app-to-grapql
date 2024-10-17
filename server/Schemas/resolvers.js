const { User } = require("../models");

const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    // This query is used to fetch all the users that have created an account
    users: async (parent, args) => {
      return User.find({});
    },
    // The me query will uses the context parameter to fetch the data
    // of the user that is currently logged from the token
    // This will be used mainly to display there saved books
    me: async (parent, args, context) => {
      try {
        console.log("Context", context.user);
        // Verifies that context is not null
        if (context.user) {
          // If user is logged in send all their data to the front-end
          return User.findOne({ _id: context.user._id });
        }
        // If there no user logged in throw an authentification error
        throw AuthenticationError;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    // This mutation will verify that a user has an account and send a token
    // to keep track of the current user
    login: async (parent, { email, password },{res}) => {
      try {
        // Find the user by the email
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("User not found");
        }

        // Use a method from the mongoose schema to verify the password input
        const verifyPw = await user.isCorrectPassword(password);
        if (!verifyPw) {
          throw new AuthenticationError("Incorrect password");
        }

        // If the user is verified we create a token by calling the signToken function
        const token = signToken(user);
        res.cookie("token", token,{
          httpOnly:true,
          secure:false,
          sameSite:'Strict',
          maxAge:3600000
        })
        // Send the user data to the front-end and the token to keep track of the current user
        return { user };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // This mutation is used to create a new user profile
    addUser: async (parent, args) => {
      try {
        // Take the properties inside of args and use it to create User account
        const user = await User.create({ ...args });
        // Once the account is created, use that information to create a token
        const token = signToken(user);
        // Once the token and user account is created they are signed in
        return { token, user };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // This saves a book to the user field of savedBooks
    saveBook: async (parent, args, context) => {
      // Verify that a user is signed by checking the context parameter
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }
      // From there we look up the account using the id from context
      try {
        return User.findByIdAndUpdate(
          context.user._id,
          // we add the new saved books by destructing all of the properties from args so
          // that it will create a book to be saved to this field
          { $addToSet: { savedBooks: { ...args } } },
          { new: true, runValidators: true }
        );
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // This mutation removes a book from the user field of savedBooks
    removeBook: async (parent, args, context) => {
      // First checkts to see if the user is logged in by seeing if
      // context has the user property
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        // We then look for the specific user through their id and
        // update the savedBooks field by calling the pull operator
        // to remove the book by finding the bookId that was passed
        // in the arguments
        return User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true, runValidators: true }
        );
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
