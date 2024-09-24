import { gql } from "@apollo/client";

export const GET_ME = gql`
  query user {
    me {
      id
      username
      email
      savedBooks
      bookCount
    }
  }
`;
