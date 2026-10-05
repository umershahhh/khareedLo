import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";

const AppState = (props) => {
  const url = "http://localhost:4000/api";
  const [products, setproducts] = useState([]);
  const [token, setToken] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterData, setFilterData] = useState([]); 
  const [user, setUser] = useState();
  const [cartData, setCartData] = useState([]);
  const [reload, setReload] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const api = await axios.get(`${url}/products/getAll`, {
        headers: {
          "content-type": "Application/json",
        },
        withCredentials: true,
      });
      setproducts(api.data.products);
      setFilterData(api.data.products);
    };
    localStorage.getItem("token") && setToken(localStorage.getItem("token"));

    fetchProducts();
    userProfile();
    getCart()
    fetchUserAddress();
  }, [token, reload]);

  useEffect(() =>{
    localStorage.getItem("token") && setToken(localStorage.getItem("token"));
    setIsAuthenticated(localStorage.getItem("token") ? true : false)
  })

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

  const logout = () =>{
    setIsAuthenticated(false);
    setToken("")
    localStorage.removeItem('token')
  }

  //profile

   const userProfile = async () => {
    const api = await axios.get(
      `${url}/users/getProfile`,
      {
        headers: {
          "content-type": "Application/json",
          "Auth": token,
        },
        withCredentials: true,
      },
    );
    console.log(api.data,"user profile");
    setUser(api.data.user)
    // return api.data;
    // console.log("user registered", api)
    // alert(api.data.message)
  };

  //add to cart

    const addToCart = async (productId, title, price, qty, category, imgSrc) => {
      const api = await axios.post(`${url}/cart/add`, {
        productId, title, price, qty, category, imgSrc
      }, {
        headers: {
          "content-type": "Application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      setReload(!reload)
      // console.log(api.data)
    };

    const getCart = async () => {
      const api = await axios.get(`${url}/cart/getUser`,  {
        headers: {
          "content-type": "Application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      console.log(api.data, "user get cart")
      setCartData(api.data.cart)
    };

    const decreaseQty = async (productId, qty) => {
      const api = await axios.post(`${url}/cart/decrease-qty`, 
        {productId, qty},  {
        headers: {
          "content-type": "Application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      console.log(api, "decrease qty")
      setReload(!reload)
    };

    const removeFromCart = async (productId) => {
      const api = await axios.delete(`${url}/cart/remove/${productId}`, 
         {
        headers: {
          "content-type": "Application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      console.log(api, "remove from cart")
      setReload(!reload)
    };

    //clear cart
    const clearCart = async () => {
      const api = await axios.delete(`${url}/cart/clear/${user?._id}`, 
         {
        headers: {
          "content-type": "Application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      console.log(api, "clear cart")
      setReload(!reload)
    };

    //shipping

    const shippingAddress = async (fullName, address, city, state, country, phoneNumber) => {
      const api = await axios.post(`${url}/address/add`, {
        fullName, address, city, state, country, phoneNumber
      }, {
        headers: {
          "content-type": "Application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      return api.data;
      setReload(!reload)
      // console.log(api.data)
    };

    //get old address

    const fetchUserAddress = async () => {
      const api = await axios.get(`${url}/address/get`, {
        headers: {
          "content-type": "Application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      // console.log(api.data.userAddress, "user address fetched")
      setUserAddress(api.data.userAddress)
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
        userAddress
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
