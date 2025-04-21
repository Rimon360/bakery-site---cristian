const express = require("express");
const {registerUser, loginUser, getUsers, deleteUser, getProtectedData} = require("../controllers/userController");
const {authMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/protected", authMiddleware, getProtectedData);
router.delete("/:id", deleteUser);
router.post("/dashboard", authMiddleware);

module.exports = router;
