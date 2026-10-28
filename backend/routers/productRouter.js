const express = require("express");

const router = express.Router();

const {addProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct} = require("../controllers/product.js")

// add product
router.post("/add", addProduct);

//get all products
router.get("/getAll", getAllProducts);

//get one product
router.get("/getOne/:id", getOneProduct);

module.exports = router;