import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import {useNavigate} from 'react-router-dom'



const Cart = () => {
  const { cartData, decreaseQty, addToCart, removeFromCart, clearCart } = useContext(AppContext);
  const navigate = useNavigate();
  const [totalPrice, setTotalprice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  useEffect(() => {
    let totalPrice = 0;
    let totalQty = 0;

    for (let i = 0; i < (cartData?.items?.length || 0); i++) {
      totalPrice += cartData.items[i].price;
      totalQty += cartData.items[i].qty;
    }

    setTotalprice(totalPrice);
    setTotalQty(totalQty);
  }, [cartData]);

  return (
    // console.log(cartData, "cart data")
    <div>
      <>
        <div className="">cart</div>
      </>
      <div className="">
        <div className="">Total Items: {totalQty} </div>
        <div className="">Total Price: ${totalPrice} </div>
      </div>
      {cartData?.items.map((product) => {
        return (
          <div key={product._Id} className="flex gap-5">
            <p>product name: {product?.title}</p>
            <p>product price: {product?.price}</p>
            <p>product quantity: {product?.qty}</p>
            <button onClick={() =>{addToCart(product.productId, product.title, product.price/product.qty, 1, product.category, product.imgSrc)}} className="bg-green-500 text-white py-2 px-4 rounded-full">
              Increase QTY
            </button>
            <button
              onClick={() => decreaseQty(product.productId, 1)}
              className="bg-amber-500 text-white py-2 px-4 rounded-full"
            >
              Decrease QTY
            </button>
            <button onClick={() => removeFromCart(product.productId)} className="bg-red-500 text-white py-2 px-4 rounded-full">
              Remove
            </button>
          </div>
        );
      })}

      {cartData?.items?.length > 0 && (
        <>
        <button  className="bg-blue-500 text-white py-2 px-4 rounded-full" onClick={()=> navigate('/shipping')}>Checkout</button>
        <button className="bg-red-500 text-white py-2 px-4 rounded-full" onClick={clearCart}>
          Clear Cart
        </button>
        </>
      )}
    </div>
  );
};

export default Cart;
