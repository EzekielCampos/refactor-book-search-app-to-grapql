import { gql } from "@apollo/client";

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
