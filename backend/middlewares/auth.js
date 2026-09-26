const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User.js");

const Authenticated = async(req,res, next) =>{
  const token = req.header("Auth");
  if(!token){
    return res.status(400).json({message: "Please Login first", success: false})
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId

    let user = await User.findById(id);

    if(!user){
      res.json({message: "User not exists", success: fail});
    }
    req.user = user;
    next();
    
  }
  catch(error){
    return res.status(400).json({message: "Invalid Token", success: false})
  }
  return res.status(200)

}

module.exports = {Authenticated}