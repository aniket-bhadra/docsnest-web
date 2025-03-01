// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Login = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill all the fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/userRoutes/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      // Redirect to dashboard
      navigate("/profile");
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Processing..." : "Login"}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?
          <button type="button" className="toggle-button" onClick={toggleForm}>
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
};

export default Login;
