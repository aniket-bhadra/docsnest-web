// Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import avatars from "../constants/avatars";

const Signup = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  });
  const [showAvatars, setShowAvatars] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectAvatar = (avatarUrl) => {
    setFormData({
      ...formData,
      pic: avatarUrl,
    });
    setShowAvatars(false);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all the fields");
      return false;
    }
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    // Password validation (at least 6 characters)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
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
      const response = await axios.post("http://localhost:3001/userRoutes", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        pic: formData.pic,
      });

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      // Redirect to dashboard
      navigate("/profile");
    } catch (error) {
      setError(
        error.response?.data?.error || "Something went wrong. Please try again."
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
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

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

        <div className="avatar-section">
          <label>Profile Picture</label>
          <div
            className="selected-avatar"
            onClick={() => setShowAvatars(!showAvatars)}
          >
            <img src={formData.pic} alt="Selected Avatar" />
            <span>{showAvatars ? "Close" : "Choose Avatar"}</span>
          </div>

          {showAvatars && (
            <div className="avatar-grid">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`avatar-item ${
                    formData.pic === avatar ? "selected" : ""
                  }`}
                  onClick={() => selectAvatar(avatar)}
                >
                  <img src={avatar} alt={`Avatar ${index}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Processing..." : "Create Account"}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?
          <button type="button" className="toggle-button" onClick={toggleForm}>
            Login
          </button>
        </p>
      </div>
    </>
  );
};

export default Signup;
