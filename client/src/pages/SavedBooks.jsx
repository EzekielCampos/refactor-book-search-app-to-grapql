import { Container, Card, Button, Row, Col } from "react-bootstrap";
// Need both query and mutation hook to make those request
import { useQuery, useMutation } from "@apollo/client";
// This query will get the current user that is logged in data
import { GET_ME } from "../utils/queries";
// This mutation will remove a book that was saved in their profile
import { REMOVE_BOOK } from "../utils/mutations";

import { Navigate } from "react-router-dom";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  // Call this query to get all the data of the current logged in user
  const { data, loading, error } = useQuery(GET_ME);
  // We first verify that the data was successfully queried if not we return an empty object
  const userData = data?.me || {}; // Directly using the data from the query

  // This mutation will update the savedBooks field in the backend
  const [deleteBook] = useMutation(REMOVE_BOOK, {
    // Since a field is being updated we need to refetch
    // the user data that was changed
    refetchQueries: [GET_ME, "me"],
  });

  // Now handle the conditional logic after calling the hook
  if (!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  if (error) return <div>Error fetching data</div>;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    // Verifies that a user is logged in 
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Use the function that was returned from the mutation hook and place the 
      // bookId that wants to be deleted as the parameter for the mutation
      // eslint-disable-next-line no-unused-vars
      const { data } = await deleteBook({
        variables: { bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
