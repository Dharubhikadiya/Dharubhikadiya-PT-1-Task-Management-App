import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Container, Form, Button, Alert } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { auth, provider, signInWithPopup } from "./Firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please fill email.");
      return;
    }

    if (!password) {
      toast.error("Please fill password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format.");
      return;
    }

    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!registeredUser) {
      toast.error("Please register first before logging in.");
      return;
    }

    if (registeredUser.email !== email || registeredUser.password !== password) {
      toast.error("Invalid email or password.");
      return;
    }

    toast.success("Login successful!");
    navigate("/todolist");
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        toast.success("Google login successful!");
        navigate("/todolist");
      })
      .catch((error) => {
        toast.error("Google login failed.");
        console.error("Google login error:", error);
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <div id="login-box2">
            <div class="left2">
              <h1 className="fw-bold d-flex justify-content-start">Login</h1>

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

              <input
                type="submit"
                value="Login"
              />

              <div className="mt-3 text-center d-flex py-2">
                <span>Don't have an account? </span>
                <Link className="text-primary text-decoration-none" to="/register">
                  Register
                </Link>
              </div>

              <button
                className="social-signin google mt-2"
                type="button"
                onClick={handleGoogleLogin}
              >
                Log in with Google+
              </button>

            </div>
          </div>
        </Form>

        <ToastContainer />
      </div>
    </Container>
  );
};

export default Login;
