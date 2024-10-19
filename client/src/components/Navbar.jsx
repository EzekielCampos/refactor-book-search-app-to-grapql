import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { useGlobalState } from "../utils/GlobalState";
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "../utils/mutations";
import { getLoginStatus, removeLoginStatus } from "../utils/idb";

// import Auth from '../utils/auth';

const AppNavbar = () => {
  const [state, dispatch] = useGlobalState();
  console.log(state);
  const [logout] = useMutation(LOGOUT_MUTATION);
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  const result = async ()=>{
    const result = await getLoginStatus();
    console.log(result)
    if (result) {
      dispatch({
        type: "LOGIN",
      });
    }

  }

  useEffect(() => {
   result();
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            Google Books Search
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar" className="d-flex flex-row-reverse">
            <Nav className="ml-auto d-flex">
              <Nav.Link as={Link} to="/">
                Search For Books
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {!state.loggedIn ? (
                <Nav.Link onClick={() => setShowModal(true)}>
                  Login/Sign Up
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={Link} to="/saved">
                    See Your Books
                  </Nav.Link>
                  <Nav.Link
                    onClick={async () => {
                      try {
                        await logout();
                        dispatch({
                          type: "LOGOUT",
                        });
                        await removeLoginStatus();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
