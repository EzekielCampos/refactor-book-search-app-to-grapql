import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
// Import the useMutation hook to make a request to use the login mutation
import { useMutation } from "@apollo/client";
// This is the specific mutation that will be used to verify the user credentials
import { LOGIN_USER } from "../utils/mutations";
import { useGlobalState } from "../utils/GlobalState";

// import Auth from "../utils/auth";

const LoginForm = () => {
  const [dispatch] = useGlobalState();
  // This is the state that will hanlde the input updates
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // When destructured the loginUser function will be used to send
  // a request to the backend to verify user credentials
  const [loginUser] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    // Updates the input fields on change
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // This is the function from the mutation and it will take the inputs
      // and send them as parameters that are needed for this mutation
      const { data } = await loginUser({
        variables: { ...userFormData },
      });
      console.log(data);
      if (data) {
        dispatch({
          type: "LOGIN",
        });
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
