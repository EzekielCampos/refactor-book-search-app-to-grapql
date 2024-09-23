const { Query } = require("mongoose");
const { User } = require("../models");

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    me: async (root, args, context) => {
      if (context.user) {
        return User.findById(context.user._id);
      }
    },
  },
};


module.exports = resolvers