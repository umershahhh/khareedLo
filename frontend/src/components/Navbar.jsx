import React, { useContext, useState } from "react";
import { Navigate, useNavigate, Link, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { products, setFilterData, logout ,isAuthenticated } = useContext(AppContext);
  const onSubmitHandler = (e) => {
    e.preventDefault();
    navigate(`/products/search/${searchText}`);
  };
  const filterByCategory = (category) => {
  if (!products || !category) return;

  setFilterData(
    products.filter(
      (data) =>
        data?.category?.toLowerCase() === category.toLowerCase()
    )
  );
};
  const filterByPrice = (price) => {
  if (!products || !price) return;

  setFilterData(
    products.filter(
      (data) =>
        data?.price >=  price
    )
  );
};
  return (
    <div>
      <div className="nav flex bg-amber-800 py-5">
        <div className="flex gap-5 justify-center items-center">
          <Link
            to={"/"}
            className="logo cursor-pointer bold text-4xl py-3 px-2 rounded-full"
          >
            Mern Stack
          </Link>
          {isAuthenticated && (
            <>
             <button className="cart cursor-pointer bg-amber-300 py-3 px-2 rounded-full">
            cart
          </button>
         
          <button className="profile cursor-pointer bg-amber-300 py-3 px-2 rounded-full">
            profile
          </button>
          <button onClick={()=>{
            logout()
            navigate('/')
          }} className="logout cursor-pointer bg-amber-300 py-3 px-2 rounded-full">
            logout
          </button>
          </>
          )}
         {!isAuthenticated && (
          <>
          <Link to={'/login'} className="login cursor-pointer bg-amber-300 py-3 px-2 rounded-full">
            login
          </Link>
          <Link
            to={"/register"}
            className="register cursor-pointer bg-amber-300 py-3 px-2 rounded-full"
          >
            register
          </Link>
          </>
         )}

          <form action="" onSubmit={onSubmitHandler}>
            <input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              type="search"
              className="bg-black outline-0 py-2 rounded-full text-white px-2"
            />
          </form>
        </div>
      </div>

      {location.pathname == '/' && (
  <div className="sub-nav flex bg-amber-500 justify-between p-5 items-center">
        <div
          onClick={() => setFilterData(products)}
          className="items hover:bg-black hover:text-white hover:cursor-pointer"
        >
          No Filter
        </div>
        <div
          onClick={() => filterByCategory("mobile")}
          className="items hover:bg-black hover:text-white hover:cursor-pointer"
        >
          Mobiles
        </div>
        <div
          onClick={() => filterByCategory("laptop")}
          className="items hover:bg-black hover:text-white hover:cursor-pointer"
        >
          Laptop
        </div>
        <div
          onClick={() => filterByCategory("accessories")}
          className="items hover:bg-black hover:text-white hover:cursor-pointer"
        >
          Accessories
        </div>
        <div
          onClick={() => filterByCategory("headphone")}
          className="items hover:bg-black hover:text-white hover:cursor-pointer"
        >
          Headphones
        </div>
        <div
          onClick={() => filterByPrice(10000)}
          className="items hover:bg-black hover:text-white hover:cursor-pointer"
        >
          12000
        </div>
        <div
          onClick={() => filterByPrice(5000)}
          className="items hover:bg-black hover:text-white hover:cursor-pointer"
        >
          6000
        </div>
      </div>
      )}

    
    </div>
  );
};

export default Navbar;
