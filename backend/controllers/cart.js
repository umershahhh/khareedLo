const Cart = require("../models/Cart.js");

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

const decreaseProductQty = async (req, res) => {
  const userId = req.user;
  const { productId, qty } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    // No cart exists
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Find product inside the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    // Product doesn't exist in this user's cart
    if (existingItemIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    const item = cart.items[existingItemIndex];

    // Make sure qty is a number
    const decreaseAmount = Number(qty);

    if (!decreaseAmount || decreaseAmount <= 0) {
      return res.status(400).json({
        message: "Invalid quantity",
        success: false,
      });
    }

    // Calculate unit price
    const pricePerUnit = item.price / item.qty;

    // If decreasing would make qty 0 or less, remove item
    if (item.qty <= decreaseAmount) {
      cart.items.splice(existingItemIndex, 1);
    } else {
      item.qty -= decreaseAmount;
      item.price -= pricePerUnit * decreaseAmount;
    }

    await cart.save();

    return res.status(200).json({
      message: "Item quantity decreased successfully",
      cart,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
      success: false,
    });
  }
};

module.exports = { addToCart, getOneCart, removeProductFromCart, clearCart, decreaseProductQty };
