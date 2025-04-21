const express = require("express");
const {createProduct, getProductByShopId, updateProductById, deleteProductById} = require("../controllers/productController");
const {memberMiddleware, adminMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", adminMiddleware, createProduct);
router.post("/update", memberMiddleware, updateProductById);
router.delete("/delete", adminMiddleware, deleteProductById);
router.get("/:id", memberMiddleware, getProductByShopId);

module.exports = router;
