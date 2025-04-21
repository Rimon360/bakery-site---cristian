const productModel = require("../models/productModel");
const {seq} = require("../utils/util");
module.exports.createProduct = async (req, res) => {
  const {shop_id, product_name} = req.body;
  if (!shop_id) {
    return res.status(400).json({message: "shop name and password are required"});
  } 
  const products = await productModel.create({
    seq: seq(),
    product_name,
    shop_id,
  });
  if (products) {
    res.status(200).json({
      message: "Product created successfully",
      products,
    });
  }
};

module.exports.getProductByShopId = async (req, res) => {
  const {id} = req.params;
  if (!id) {
    res.status(400).json({message: "Shop id is required"});
  }
  const products = await productModel.find({shop_id: id}).sort({createdAt: -1});
  res.status(200).json({
    products,
  });
};
module.exports.updateProductById = async (req, res) => {
  try {
    const {id, wastage, baked} = req.body;
    const products = await productModel.updateOne({_id: id}, {$set: {wastage, baked}});
    res.status(200).json({
      message: "success",
      products
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
module.exports.deleteProductById = async (req, res) => {
  try {
    const {id} = req.body;
    if (!id) {
      return res.status(400).json({message: "Product id is required"});
    }
    const products = await productModel.deleteOne({_id: id});
    if (!products) {
      return res.status(400).json({message: "Deletation failed!"});
    }
    res.status(200).json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
