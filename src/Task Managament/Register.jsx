import React, { useState } from "react";
import './Register.css';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Container, Form, Button, Alert } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, mobileNumber } = formData;

    if (!username) {
      toast.error("Username is required.");
      return false;
    }
    if (!email) {
      toast.error("Email is required.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email is invalid.");
      return false;
    }
    if (!mobileNumber) {
      toast.error("Mobile number is required.");
      return false;
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      toast.error("Mobile number must be 10 digits.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    if (!confirmPassword) {
      toast.error("Confirm Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const { username, email, password, mobileNumber } = formData;
      const userData = { username, email, password, mobileNumber };
      localStorage.setItem("registeredUser", JSON.stringify(userData));

      toast.success("Registration successful! Now you can log in.");
      navigate("/");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <div id="login-box">
            <div class="left">
              <h1 className="fw-bold d-flex justify-content-start">Sign up</h1>

              <input type="text" name="username" value={formData.username}
                onChange={handleChange} placeholder="Username" />

              <input type="text" name="email" value={formData.email}
                onChange={handleChange} placeholder="E-mail" />

              <input type="text" name="mobileNumber" value={formData.mobileNumber}
                onChange={handleChange} placeholder="Phone Number" />

              <input type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Password" />

              <input type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} placeholder="Retype password" />

              <input type="submit" name="signup_submit" value="Sign me up" />

              <div className="mt-3 text-center d-flex py-2">
                <span>Already have account? </span><Link className="text-decoration-none text-primary ps-1" to="/">Login</Link>

              </div>
            </div>

          </div>
        </Form>

      </div>
      <ToastContainer />
    </Container>


  );
};

export default Register;