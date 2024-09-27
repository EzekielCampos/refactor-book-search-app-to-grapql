import { gql } from "@apollo/client";

// This mutation will take two parameters, which is the credentials
// needed to verify a user.  It's requesting in the return data
// the token and from the user just the id and username
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// This mutation takes three parameters which are data needed to create 
// a new account.  It's requesting in the return data a token and from the 
// user the id and username
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// This mutation requires all the information from the book so that
// it can be saved into the users account and a new instance of the book
// will be created.  In the return data it's requesting all the information about
// the deleted book and the username of the current logged in user
export const SAVE_BOOK = gql`
  mutation saveBook(
    $authors: [String!]!
    $title: String!
    $bookId: String!
    $image: String!
    $link: String!
    $description: String!
  ) {
    saveBook(
      authors: $authors
      title: $title
      bookId: $bookId
      image: $image
      link: $link
      description:$description
    ) {
      username
      savedBooks {
        authors
        title
        bookId
        image
        link
        description
      }
    }
  }
`;



// This mutation requires all the information from the book so that
// it can be removed from the users account. In the return data it's requesting 
// all the information about the newly saved book and the username of the current logged in user
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      username
      savedBooks {
        authors
        title
        bookId
        image
        link
      }
    }
  }
`;
