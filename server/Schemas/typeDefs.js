const typeDefs = `
  type User {
  # This schema will dictate what data can be returned from the corresponding mongo Model
    _id: ID
    username: String
    email: String
    bookCount: Int
    # This will return an array of the schema Book for all the users saved books
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
  # This schema will be used for when we have to send a token and the user data back to the front end
    user: User
  }

  type Query {
    users: [User]
    me: User
  }

  #The mutations are used for login credentials or to either perfrom a add or delete of a book from the user saved list
  type Mutation {
    login(email: String!, password: String!): Auth
     logout: Boolean!
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String!]!, title: String!, bookId: String!, image: String!, link: String!,description:String!): User
    removeBook(bookId: String!): User
  }

`;

module.exports = typeDefs;
