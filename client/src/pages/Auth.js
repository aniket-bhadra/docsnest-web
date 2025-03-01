// Auth.jsx
import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Sigup";
import "../styles/styles.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Login to continue" : "Sign up to get started"}</p>
        </div>

        {isLogin ? (
          <Login toggleForm={toggleForm} />
        ) : (
          <Signup toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default Auth;
