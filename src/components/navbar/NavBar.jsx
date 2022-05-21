import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Logout } from "./";


const NavBar = () => {
  const { user, isLoggedIn } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="button-container-home">
        <div className="button-home">
          <Link to={"/"}>Home</Link>
        </div>
      </div>

      {user.isAdmin ? (
        <div className="button-container-admin">
          <div className="button-admin">
            <Link to={"/admin"}>Admin</Link>
          </div>
        </div>
      ) : null}
      {!isLoggedIn ? (
        <>
          <div className="button-container-login">
            <div className="button-login">
              <Link to={"/login"}>Login</Link>
            </div>
          </div>
          <div className="button-container-register">
            <div className="button-register">
              <Link to={"/register"}>Register</Link>
            </div>
          </div>
        </>
      ) : (
        <div className="button-container-logout">
          <div className="button-logout">
            <Logout />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
