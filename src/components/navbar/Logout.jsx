// Component that renders a logout button on the navbar
import React from "react";
import { logoutUser } from "../../AJAXFunctions";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const Logout = () => {
  const { setIsLoggedIn, setUser } = useAuth();
  let navigate = useNavigate();

  /* On click, it hits the logout route and the response gives a boolean. When false, we change the the logged 
  in state and send a toastify message. We then also send them back to the home page
  */
  async function clickHandler(e) {
    e.preventDefault();
    const response = await logoutUser();
    if (!response.loggedIn) {
      toast(response.message);
      setIsLoggedIn(false);
      setUser({});
      navigate("/");
    }
  }
  return (
    <Link onClick={clickHandler} to={"/"}>
      Logout
    </Link>
  );
};

export default Logout;
