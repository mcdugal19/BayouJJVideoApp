//*** AuthProvider provides the connection from the main App in the index.js  ****/

import AuthContext from "../AuthContext";
import { useState, useEffect } from "react";
import { getMe, fetchAllVideos } from "../AJAXFunctions";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [videos, setVideos] = useState([]);
//   const [cart, setCart] = useState([]);
  const [searchItems, setSearchItems] = useState([]);
//   const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await getMe();
        if (response.id) {
          setUser(response);
          setIsLoggedIn(true);
        //   setCart(response.cart);
        }
      } catch (error) {
        throw error;
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    async function getVideos() {
      try {
        const videos = await fetchAllVideos();
        setVideos(videos);
        setSearchItems(videos);
      } catch (error) {
        throw error;
      }
    }
    getVideos();
  }, [setVideos]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        vidoes,
        setVideos,
        // cart,
        // setCart,
        searchItems,
        setSearchItems,
        // orders,
        // setOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;