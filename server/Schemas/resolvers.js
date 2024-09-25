const { User } = require("../models");

const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      try {
        if (context.user) {
          return User.findById(context.user._id);
        }
        throw AuthenticationError;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("User not found");
        }

        const verifyPw = await user.isCorrectPassword(password);
        if (!verifyPw) {
          throw new AuthenticationError("Incorrect password");
        }

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    addUser: async (parent, args) => {
      try {
        const profile = await User.create({ ...args });
        const token = signToken(profile);
        return { token, profile };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    saveBook: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        return User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: { ...args } } },
          { new: true, runValidators: true }
        );
      } catch (error) {
        throw new Error(error.message);
      }
    },
    removeBook: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
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
