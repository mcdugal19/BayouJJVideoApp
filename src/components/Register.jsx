// This component is for the Registration page

import React, { useState } from "react";
import { registerUser } from "../AJAXFunctions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const { setUser, setIsLoggedIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [email, setEmail] = useState("");
  let navigate = useNavigate();

  return (
    <div className="register-page">
      <h2>Welcome to Amiibay!</h2>
      {/* The form below is the form that verifies login credentials */}
      <div className="form-container">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              if (password === confirmationPassword && password.length > 0) {
                const response = await registerUser(username, password, email);
                if (response.user) {
                  setIsLoggedIn(true);
                  setUser(response.user);
                  toast(response.message);
                  setTimeout(() => navigate("/"), 1000);
                } else {
                  toast.error(response.message);
                }
              } else {
                toast.error("Must have passwords that match, try again :/");
              }
            } catch (error) {
              console.error(
                "There was a problem with your registration information.",
                error
              );
            }
          }}
        >
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="password"
            value={confirmationPassword}
            placeholder="Password Confirmation"
            onChange={(e) => {
              setConfirmationPassword(e.target.value);
            }}
          />
          <input
            type="text"
            value={email}
            placeholder="Email Required"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
