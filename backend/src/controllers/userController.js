const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {seq} = require("../utils/util");
module.exports.registerUser = async (req, res) => {
  const {username, password, role} = req.body;
  if (!role) role = "member";
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  // check if user exists
  const userExists = await UserModel.findOne({username});
  if (userExists) {
    console.log(await UserModel.find());

    return res.status(400).json({message: "User already exists"});
  }
  // hash password
  const solt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, solt);
  // create user
  const random = seq();
  const user = await UserModel.create({
    seq: random,
    username,
    password: hashedPassword,
    role,
  });
  if (user) {
    res.status(200).json({
      message: "User registered successfully",
      user,
      token: generateToken(user._id),
    });
  }
};

exports.loginUser = async (req, res) => {
  const {username, password} = req.body;

  try {
    const user = await UserModel.findOne({username});
    if (!user) {
      console.log("User not found");
      return res.status(400).json({message: "Invalid credentials"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({message: "Invalid credentials"});
    }
    const token = jwt.sign({_id: user._id, username: user.username, role: user.role}, process.env.JWT_SECRET || "abc123", {expiresIn: "30d"});
    console.log("Login successful, Token generated");
    res.json({token});
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({message: "Error logging in", error: err});
  }
};

// Generate jwt
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET || "abc123", {
    expiresIn: "30d",
  });
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().sort({createdAt: -1});
    res.json(users);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    console.log(deletedUser);

    if (!deletedUser) return res.status(404).json({message: "User not found"});
    res.json({message: "User deleted successfully"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};

// Get protected data (requires JWT)
exports.getProtectedData = (req, res) => {
  res.json({message: "This is protected data", user: req.user});
};

// const loginUser = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await UserModel.findOne({ username, password });
//         if (!user) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }
//         res.status(200).json({ message: "Login successful", user });
//     } catch (error) {
//         res.status(500).json({ message: "Error logging in", error });
//     }
// };
