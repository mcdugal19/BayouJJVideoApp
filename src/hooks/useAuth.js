//*** The Use Auth hook is the main connector throughout our source components to declare our state dependant variables that need to persist within multiple components. This hook allowed us to avoid excessive prop threading throughout our components. */



import { useContext } from "react";
import AuthContext from "../AuthContext";


const useAuth = () => {
  const {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    // products,
    // setProducts,
    // cart,
    // setCart,
    searchItems,
    setSearchItems,
    // orders,
    // setOrders,
  } = useContext(AuthContext);

  return {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    // products,
    // setProducts,
    // cart,
    // setCart,
    searchItems,
    setSearchItems,
    // orders,
    // setOrders,
  };
};

export default useAuth;
