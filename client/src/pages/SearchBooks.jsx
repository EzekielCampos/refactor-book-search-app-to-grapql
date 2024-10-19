import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
// Need both query and mutation hook to make those request
import { useMutation, useQuery } from "@apollo/client";

import { SAVE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries";
import { useGlobalState } from "../utils/GlobalState";

import { searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

const SearchBooks = () => {
  const [state] = useGlobalState();
  const { loggedIn } = state;
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  const [saveBook] = useMutation(SAVE_BOOK, {
    refetchQueries: [{ query: GET_ME }], // Ensure to refetch user data after saving a book
  });
  // Fetches the current users data to be used
  const { data } = useQuery(GET_ME);
  // Need to verify that the query has the necessary information.  This will be
  // used to verify if a book that shows up in the result has already been saved
  // as opposed to saving it to local storage.  Therefore the search will be
  // unique for each user
  const userData = data?.me || {}; // Directly using the data from the query
  // console.log(data.me);
  console.log(userData);
  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }
    try {
      // This will take the user input and make a search from the google API
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      // Destructure the results
      const { items } = await response.json();

      // Get the necessary data from the api call and store them in a variable
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || "No description",
        image: book.volumeInfo.imageLinks?.thumbnail || "",
        link: book.volumeInfo.infoLink,
      }));

      // Update the state for all the results
      setSearchedBooks(bookData);
      // Clear out the input field
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    console.log(bookToSave);
    // get token to verify if user is logged in

    if (!loggedIn) {
      return false;
    }

    try {
      // Use the function from the mutation hook so save a book to the user's account
      const { data } = await saveBook({
        // pass the book data as parameters
        variables: { ...bookToSave },
      });
      console.log("test", data.saveBook);
      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
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
                    {loggedIn && (
                      <Button
                        disabled={userData.savedBooks?.some(
                          (savedBookId) => savedBookId.bookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {userData.savedBooks?.some(
                          (savedBookId) => savedBookId.bookId === book.bookId
                        )
                          ? "This book has already been saved!"
                          : "Save this Book!"}
                      </Button>
                    )}
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

export default SearchBooks;
