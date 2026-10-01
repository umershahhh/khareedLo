import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";

const AppState = (props) => {
  const url = "http://localhost:4000/api";
  const [products, setproducts] = useState([]);
  const [token, setToken] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterData, setFilterData] = useState([]);
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
    fetchProducts();
  }, [token]);

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
        logout
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
