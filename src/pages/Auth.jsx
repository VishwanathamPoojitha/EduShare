import React from "react";
import Login from "./Login";
import Register from "./Register";
import "../App.css";

const Auth = () => {
  return (
    <div className="auth_container">
      <div className="login_section">
        <Login />
      </div>

      <div className="register_section">
        <Register />
      </div>
    </div>
  );
};

export default Auth;