const express = require("express");
const router = express.Router();
const {addToCart, getOneCart, removeProductFromCart, clearCart, decreaseProductQty} = require("../controllers/cart.js")

const {Authenticated} = require("../middlewares/auth.js")

// add to cart
router.post("/add", Authenticated, addToCart);

// get one cart

router.get("/getUser", Authenticated, getOneCart);

// remove from cart

router.delete("/remove/:productId", Authenticated, removeProductFromCart)

// clear cart

router.delete("/clear/:userId", Authenticated, clearCart)

// decrease product quantity

router.post("/decrease-qty", Authenticated, decreaseProductQty);

module.exports = router;