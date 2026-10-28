const Product = require("../models/Product.js");

//add product

const addProduct = async (req, res) =>{ 
  const {title,description, imgSrc, category, qty, price} = req.body;
  try {
      if(!title || !description || !imgSrc || !category || !qty || !price){
        return res.status(400).json({message: "Please fill all the fields", success: false})
      }
      const newProduct = await Product.create({title,description, imgSrc, category, qty, price});
      res.status(200).json({message: "product added successfully", product: newProduct, success: true})
    }
    catch (error) {
      res.status(500).json({message: error.message, success: false})
    }
  }

//get all products

const getAllProducts = async (req, res) =>{
  try{
const products = await Product.find().sort({createdAt: -1});
  res.status(200).json({message: "all products fetched successfully", products, success: true})
  }
  catch(error){
    res.status(400).json({message:error.message, success: false})
  }

}

//get one product

const getOneProduct = async (req, res) =>{
  const {id} = req.params;
  try{
  const product = await Product.findById(id);
  res.status(200).json({message: "Product fetched successfully", product, success: true})
  }
  catch(error){
    res.status(400).json({message:error.message, success: false})
  }
}


module.exports = {addProduct, getAllProducts, getOneProduct}