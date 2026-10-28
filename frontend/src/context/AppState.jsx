import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";


const AppState = (props) => {
  const url = "http://localhost:4000/api";
  const [products, setproducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [token, setToken] = useState(
  () => localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [user, setUser] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [reload, setReload] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

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


// 2. Fetch admin products


useEffect(() => {
  const fetchAdminProducts = async () => {
    const savedToken = localStorage.getItem("token");

    // Only fetch admin products for an authenticated admin.
    if (!savedToken || user?.role !== "admin") {
      setAdminProducts([]);
      return;
    }

    try {
      const response = await axios.get(
        `${url}/admin/getProductsList`,
        {
          headers: {
            Auth: savedToken,
          },
          withCredentials: true,
        }
      );

      setAdminProducts(response.data.products || []);
    } catch (error) {
      console.error(
        "Admin products error:",
        error.response?.status,
        error.response?.data || error.message
      );

      setAdminProducts([]);
    }
  };

  fetchAdminProducts();
}, [url, token, reload, user?.role]);






// Admin: Fetch all orders
useEffect(() => {
  const fetchAllOrders = async () => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken || user?.role !== "admin") {
      setAllOrders([]);
      return;
    }

    try {
      const response = await axios.get(`${url}/admin/getAllOrders`, {
        headers: {
          Auth: savedToken,
        },
        withCredentials: true,
      });

      setAllOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "Fetch orders failed:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
  };

  fetchAllOrders();
}, [url, token, reload, user?.role]);

// Admin: Fetch all users
useEffect(() => {
  const fetchAllUsers = async () => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken || user?.role !== "admin") {
      setAllUsers([]);
      return;
    }

    try {
      const response = await axios.get(`${url}/admin/getAllUsers`, {
        headers: {
          Auth: savedToken,
        },
        withCredentials: true,
      });

      setAllUsers(response.data.users || []);
    } catch (error) {
      console.error(
        "Fetch users failed:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
  };

  fetchAllUsers();
}, [url, token, reload, user?.role]);


// Handle expired or invalid authentication globally
useEffect(() => {
  const interceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const requestUrl = error.config?.url || "";

      // Handle expired/invalid tokens, but don't log out
      // simply because a login or registration request failed.
      if (
        status === 401 &&
        !/login|register/i.test(requestUrl)
      ) {
        localStorage.removeItem("token");

        setToken("");
        setUser(null);
        setCartData([]);
        setUserAddress(null);

        // Clear admin-only data if these states exist
        setAllOrders([]);
        setAllUsers([]);
        setAdminProducts([]);
      }

      return Promise.reject(error);
    }
  );

  return () => {
    axios.interceptors.response.eject(interceptor);
  };
}, []);

useEffect(() => {
  const fetchPrivateData = async () => {
    if (!token) {
      setCartData([]);
      setUserAddress(null);
      return;
    }

    await getCart();
    await fetchUserAddress();
  };

  fetchPrivateData();
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
    setAdminProducts([]);
    setFilterData([]);
    setUser(null);
  };

  //profile


async function userProfile() {
  try {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setUser(null);
      return null;
    }

    const api = await axios.get(`${url}/users/getProfile`, {
      headers: {
        Auth: savedToken,
      },
      withCredentials: true,
    });


    setUser(api.data.user);
    return api.data.user;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );

    setUser(null);
    return null;
  }
}


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
    setReload(!reload);
    return api.data;
    
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
    
    setUserAddress(api.data.userAddress);
  };

  //publish new product
  const publishNewProduct = async (title, description, imgSrc, category, qty, price) => {
    const api = await axios.post(
      `${url}/admin/addProduct`,
      {
        title, description, imgSrc, category, qty, price
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
    // alert(api.data.message)
  };

  //delete product
  
const deleteProduct = async (id) => {
  try {
    console.log("Product ID:", id);

    if (!id) {
      console.error("Product ID is undefined");
      return;
    }

    const api = await axios.delete(`${url}/admin/delete/${id}`, {
      headers: {
        Auth: token,
      },
      withCredentials: true,
    });

    

    setReload((prev) => !prev);
  } catch (error) {
    console.error(
      "Delete product error:",
      error.response?.data || error.message
    );
  }
};


const updateProductDetail = async (id, updatedFields) => {
  try {
    if (!id) {
      console.error("Product ID is missing");
      return false;
    }

    const response = await axios.put(
      `${url}/admin/update/${id}`,
      updatedFields,
      {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      }
    );

   

    setReload((prev) => !prev);
    return true;
  } catch (error) {
    console.error(
      "Update product error:",
      error.response?.data || error.message
    );
    return false;
  }
};

const updateOrderStatus = async (id, updatedFields) => {
  try {
    if (!id) {
      console.error("Order ID is missing");
      return false;
    }

    const response = await axios.patch(
      `${url}/admin/status/${id}`,
      updatedFields,
      {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      }
    );

    

    setReload((prev) => !prev);
    return true;
  } catch (error) {
    console.error(
      "Update Order error:",
      error.response?.data || error.message
    );
    return false;
  }
};



  return (
    <AppContext.Provider
      value={{
        allUsers,
        adminProducts,
        updateProductDetail,
        deleteProduct,
        updateOrderStatus,
        allOrders,
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
        setUser,
        addToCart,
        getCart,
        cartData,
        decreaseQty,
        removeFromCart,
        clearCart,
        shippingAddress,
        userAddress,
        publishNewProduct
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
