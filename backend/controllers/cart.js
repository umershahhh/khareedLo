const Cart = require("../models/cart.js");

// add to cart
const addToCart = async (req, res) => {
  const { productId, title, price, qty, category, imgSrc } = req.body;
  const userId = req.user;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            title,
            price,
            qty,
            category,
            imgSrc,
          },
        ],
      });
      await cart.save();
      return res
      .status(200)
      .json({
        message: "Item added to cart Successfully",
        cart,
        success: true,
      });

    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].qty += qty;
      cart.items[existingItemIndex].price += price;
    } else {
      cart.items.push({ productId, title, price, qty, category, imgSrc });
    }
    await cart.save();
    res
      .status(200)
      .json({
        message: "Item added to cart Successfully",
        cart,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, error, success: false });
  }
};

// get one cart

const getOneCart = async (req, res) =>{
  const id = req.user;
  try{
    const cart = await Cart.findOne({userId: id});
    if(!cart){
      return res.status(404).json({message: "Cart not found", success: false});
    }
    res.status(200).json({message:"cart found", cart, success: true});
  }
  catch(error){
    res.status(500).json({message: error.message, error, success: false});
  }
}

const removeProductFromCart = async (req, res) =>{
  const id = req.user;
  const productId = req.params.productId;
  try{
    let cart = await Cart.findOne({userId: id});
    if(!cart){
      return res.status(404).json({message: "Cart not found", success: false});
    }
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({message:"Product Removed", cart, success: true});
  }
  catch(error){
    res.status(500).json({message: error.message, error, success: false});
  }
}

//clear cart

const clearCart = async (req, res) =>{
  const id = req.user;
  try{
    let cart = await Cart.findOne({userId: id});
    if(!cart){
      cart = new Cart({userId: id, items: []});
    } else{
        cart.items = [];
    }
    await cart.save();

    res.status(200).json({message:"cart cleared", cart, success: true});
  }
  catch(error){
    res.status(500).json({message: error.message, error, success: false});
  }
}

// decrease qty of prduct in cart

const decreaseProductQty = async (req,res) =>{
  const userId = req.user;
  const {productId, qty} = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            title,
            price,
            qty,
            category,
            imgSrc,
          },
        ],
      });
      await cart.save();
      return res
      .status(200)
      .json({
        message: "Item added to cart Successfully",
        cart,
        success: true,
      });

    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (existingItemIndex !== -1) {
        const item = cart.items[existingItemIndex];
        if(item.qty > qty){
          const pricePerUnit = item.price / item.qty;
          item.qty -=qty;
          item.price -= pricePerUnit * qty;
        }
        else{
          cart.items.splice(existingItemIndex,1);
        }

    } else {
      return res.status(404).json({message: "Product not found in cart", success: false});
    }
    await cart.save();
    res
      .status(200)
      .json({
        message: "Item quantity decreased Successfully",
        cart,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, error, success: false });
  }

}

module.exports = { addToCart, getOneCart, removeProductFromCart, clearCart, decreaseProductQty };
