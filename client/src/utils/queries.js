import { gql } from "@apollo/client";
// This query will be used to fetch all the data from the currently logged
// in user 
export const GET_ME = gql`
  query user {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
      bookCount
    }
  }
`;