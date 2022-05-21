// This component is for the Login Page

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../AJAXFunctions";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { setUser, setIsLoggedIn, setCart } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  return (
    <div className="login-page">
      <h2>Welcome Back</h2>
      {/* The form below is the form that verifies login credentials */}
      <div className="form-container">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const response = await loginUser(username, password);
              if (response.user) {
                toast(response.message);
                setUser(response.user);
                // setCart(response.user.cart);
                setIsLoggedIn(true);
                setTimeout(() => navigate("/"), 1000);
              } else {
                toast.error(response.message);
              }
            } catch (error) {
              console.error(
                "There was a problem with your login information.",
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

          <button type="submit">Log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;