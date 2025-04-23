const productModel = require("../models/productModel");
const {seq, getDate, prependToFile} = require("../utils/util");
const mongoose = require("mongoose");
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

module.exports.getReports = async (req, res) => {
  const products = await productModel.aggregate([
    {
      $addFields: {
        shop_id_obj: {$toObjectId: "$shop_id"},
      },
    },
    {
      $group: {
        _id: "$shop_id_obj",
        products: {$push: "$$ROOT"},
      },
    },
    {
      $lookup: {
        from: "shops",
        localField: "_id",
        foreignField: "_id",
        as: "shop",
      },
    },
    {
      $unwind: "$shop",
    },
    {
      $project: {
        shop_id: "$_id",
        shop_name: "$shop.shop_name",
        products: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    products,
  });
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
    const username = req?.user?.username || "--";

    const products = await productModel.updateOne({_id: id}, {$set: {wastage, baked}});
    const data = await productModel.aggregate([
      {
        $addFields: {
          shop_id: {$toObjectId: "$shop_id"},
        },
      },
      {
        $match: {_id: new mongoose.Types.ObjectId(id)}, // replace with actual ID
      },
      {
        $lookup: {
          from: "shops",
          localField: "shop_id",
          foreignField: "_id",
          as: "shops",
        },
      },
      {$unwind: "$shops"},
      {
        $project: {
          product_name: 1,
          seq: 1,
          shop_name: "$shops.shop_name",
        },
      },
    ]);
 
    let logData = `${getDate()};${data[0].shop_name};${username};${data[0].seq};${data[0].product_name};${baked};${wastage}\n`;
    
    prependToFile("../logs/", logData);
    

    res.status(200).json({
      message: "success",
      products,
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
