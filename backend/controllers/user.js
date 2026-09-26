const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// register a new user

const registerUser = async (req, res) => {
  console.log("registerUser called");
  const {name, email, password} = req.body;
  try {
    if(!name || !email || !password){
      return res.status(400).json({message: "Please fill all the fields", success: false})
    }
    let userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).json({message:"User already exists", success: false})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({name,email,password: hashedPassword});
    res.status(201).json({message: "User registered successfully", user: newUser, success: true})
  }
  catch (error) {
    res.status(500).json({message: "Error occurred while registering user", success: false})
  }

}

// login a user

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  const userExists = await User.findOne({email});
  if(!userExists) {
    return res.status(400).json({message: "User doesn't exist", success: false})
  }
  if(userExists){
    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
    if(!isPasswordCorrect){
      return res.status(400).json({message: "Invalid credentials", success: false})
    }
    const token = jwt.sign({userId:userExists._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.status(200).json({message: `User Logged in Successfully, welcome ${userExists.name}`, token, success: true})
  }
}

// get all users

const getAllUsers = async (req, res) => {
  try{
    const users = await User.find().sort({createdAt: -1});
    res.status(200).json({message: "All users fetched successfully", users, success: true})
  }
  catch(error){
    res.status(500).json({message: "Error occurred while fetching users", success: false})
  }
}

//get user profile

const getUserProfile = async (req, res) =>{
  res.json({user:req.user})
}

module.exports = {registerUser, loginUser, getAllUsers, getUserProfile}