const express = require("express");
const {createShop, getAllShop, assignShop, unassignShop, getAssignedShops, getShopByUserId, deleteShop,getUserByShopId} = require("../controllers/shopController");
const {adminMiddleware, memberMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", adminMiddleware, createShop);
router.post("/assign", adminMiddleware, assignShop);
router.get("/getassignedshops/:user_id", adminMiddleware, getAssignedShops);
router.delete("/unassign", adminMiddleware, unassignShop);
router.delete("/delete", adminMiddleware, deleteShop);
router.get("/", getAllShop);
router.get("/member/:id", memberMiddleware, getShopByUserId);
router.get("/getuserbyshopid/:shop_id",  getUserByShopId);
module.exports = router;
