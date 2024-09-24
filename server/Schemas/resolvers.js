const { User } = require("../models");

const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      try {
        return User.find();
      } catch (error) {
        throw error;
      }
    },

    me: async (root, args, context) => {
      try {
        if (context.user) {
          return User.findById(context.user._id);
        }
        throw AuthenticationError;
      } catch (error) {
        throw error;
      }
    },
  },

  Mutation: {
    login: async (root, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw AuthenticationError;
        }

        const verifyPw = await user.isCorrectPassword(password);

        if (!verifyPw) {
          throw AuthenticationError;
        }
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        res.status(400).json({ message: error });
      }
    },
    addUser: async (root, args) => {
      try {
        const profile = User.create({ ...args });
        const token = token.sign(profile);
        return { token, profile };
      } catch (error) {
        throw error;
      }
    },
    saveBook: async (root, args, context)=>{
      try {

        return User.findByIdAndUpdate(context.user._id,
          {
            $addToSet:{savedBooks:{...args}}
          },
          {
            new:true,
            runValidators:true
          }
        )
        
      } catch (error) {
        throw error
        
      }
    }
  },
};

module.exports = resolvers;
