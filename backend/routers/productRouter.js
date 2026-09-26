const express = require("express");

const router = express.Router();

const {addProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct} = require("../controllers/product.js")

// add product
router.post("/add", addProduct);

//get all products
router.get("/getAll", getAllProducts);

//get one product
router.get("/getOne/:id", getOneProduct);

//update product
router.put('/update/:id', updateProduct)

//delete product
router.delete('/delete/:id', deleteProduct)

module.exports = router;