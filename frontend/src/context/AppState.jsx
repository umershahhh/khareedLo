import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";

const AppState = (props) => {
  const url = "http://localhost:4000/api";
  const [products, setproducts] = useState([]);
  const [token, setToken] = useState(
  () => localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [user, setUser] = useState();
  const [cartData, setCartData] = useState([]);
  const [reload, setReload] = useState(false);
  const [userAddress, setUserAddress] = useState("");

 // 1. Load token and authentication state when the component mounts
useEffect(() => {
  const savedToken = localStorage.getItem("token");

  if (savedToken) {
    setToken(savedToken);
    setIsAuthenticated(true);
  } else {
    setToken("");
    setIsAuthenticated(false);
  }
}, []);

// 2. Fetch data after the token is loaded or when reload changes
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const api = await axios.get(`${url}/products/getAll`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setproducts(api.data.products);
      setFilterData(api.data.products);
    } catch (error) {
      console.error(
        "Fetch products error:",
        error.response?.data || error.message
      );
    }
  };

  fetchProducts();

  // Only call protected APIs when a token exists
  if (token) {
    userProfile();
    getCart();
    fetchUserAddress();
  }
}, [token, reload]);

  //register

  const register = async (name, email, password) => {
    const api = await axios.post(
      `${url}/users/register`,
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "content-type": "Application/json",
        },
        withCredentials: true,
      },
    );
    return api.data;
    // console.log("user registered", api)
    // alert(api.data.message)
  };

  //login
  const login = async (email, password) => {
    const api = await axios.post(
      `${url}/users/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "content-type": "Application/json",
        },
        withCredentials: true,
      },
    );
    console.log(api.data, api.data.message, "loggin");
    // console.log("user registered", api)
    // alert(api.data.message)
    setToken(api.data?.token);
    setIsAuthenticated(true);
    localStorage.setItem("token", api.data?.token);
    return api.data;
  };

  //logout

  const logout = () => {
    setIsAuthenticated(false);
    setToken("");
    localStorage.removeItem("token");
  };

  //profile

 async function userProfile ()  {
  try{
    const savedToken = localStorage.getItem("token");
    if(!savedToken){
      console.log("No token found, user is not authenticated");
      return;
    }
    
    const api = await axios.get(`${url}/users/getProfile`, {
      headers: {
        "content-type": "Application/json",
        Auth: token,
      },
      withCredentials: true,
    });
    console.log(api.data, "user profile");
    setUser(api.data.user);
  } catch (error){
    console.error("Error fetching user profile:", error.response?.data || error.message);
  }
    
  };

  //add to cart

  const addToCart = async (productId, title, price, qty, category, imgSrc) => {
    try{
      const savedToken = localStorage.getItem("token");
      if(!savedToken){
        console.log("No token found, user is not authenticated");
        return;
      }
 const api = await axios.post(
      `${url}/cart/add`,
      {
        productId,
        title,
        price,
        qty,
        category,
        imgSrc,
      },
      {
        headers: {
          "content-type": "Application/json",
          Auth: token,
        },
        withCredentials: true,
      },
    );
    setReload(!reload);
    // console.log(api.data)
    } catch (error){
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
   
  };

  const getCart = async () => {
    const api = await axios.get(`${url}/cart/getUser`, {
      headers: {
        "content-type": "Application/json",
        Auth: token,
      },
      withCredentials: true,
    });
    console.log(api.data, "user get cart");
    setCartData(api.data.cart);
  };

  const decreaseQty = async (productId, qty) => {
    const api = await axios.post(
      `${url}/cart/decrease-qty`,
      { productId, qty },
      {
        headers: {
          "content-type": "Application/json",
          Auth: token,
        },
        withCredentials: true,
      },
    );
    console.log(api, "decrease qty");
    setReload(!reload);
  };

  const removeFromCart = async (productId) => {
    const api = await axios.delete(`${url}/cart/remove/${productId}`, {
      headers: {
        "content-type": "Application/json",
        Auth: token,
      },
      withCredentials: true,
    });
    console.log(api, "remove from cart");
    setReload(!reload);
  };

  //clear cart
  const clearCart = async () => {
    const api = await axios.delete(`${url}/cart/clear/${user?._id}`, {
      headers: {
        "content-type": "Application/json",
        Auth: token,
      },
      withCredentials: true,
    });
    console.log(api, "clear cart");
    setReload(!reload);
  };

  //shipping

  const shippingAddress = async (
    fullName,
    address,
    city,
    state,
    country,
    phoneNumber,
  ) => {
    const api = await axios.post(
      `${url}/address/add`,
      {
        fullName,
        address,
        city,
        state,
        country,
        phoneNumber,
      },
      {
        headers: {
          "content-type": "Application/json",
          Auth: token,
        },
        withCredentials: true,
      },
    );
    return api.data;
    setReload(!reload);
    // console.log(api.data)
  };

  //get old address

  const fetchUserAddress = async () => {
    const api = await axios.get(`${url}/address/get`, {
      headers: {
        "content-type": "Application/json",
        Auth: token,
      },
      withCredentials: true,
    });
    // console.log(api.data.userAddress, "user address fetched")
    setUserAddress(api.data.userAddress);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        register,
        login,
        token,
        isAuthenticated,
        setIsAuthenticated,
        url,
        filterData,
        setFilterData,
        logout,
        userProfile,
        user,
        addToCart,
        getCart,
        cartData,
        decreaseQty,
        removeFromCart,
        clearCart,
        shippingAddress,
        userAddress,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
