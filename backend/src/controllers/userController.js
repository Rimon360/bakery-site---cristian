const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.registerUser = async (req, res) => {
  // UserModel.create(req.body)
  //   .then((user) => {
  //     res.status(201).json({ message: "User registered successfully", user });
  //   })
  //   .catch((error) => {
  //     res.status(500).json({ message: "Error registering user", error });
  //   });
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  // check if user exists
  const userExists = await UserModel.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  // hash password
  const solt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, solt);
  // create user
  const user = await UserModel.create({
    username,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      message: "User registered successfully",
      user,
      token: generateToken(user._id),
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET || "abc123",
      { expiresIn: "30d" }
    );
    console.log("Login successful, Token generated");
    res.json({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Error logging in", error: err });
  }

  // const { username, password } = req.body;
  // const user = await UserModel.findOne({ username });
  // if (user && (await bcrypt.compare(password, user.password))) {
  //   res.json({
  //     message: "Login successful",
  //     token: generateToken(user._id),
  //   });
  // } else {
  //   res.status(401).json({ message: "Invalid credentials" });
  // }
};

// Generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "abc123", {
    expiresIn: "30d",
  });
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    console.log(deletedUser);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get protected data (requires JWT)
exports.getProtectedData = (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
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
