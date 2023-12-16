const mongoose = require("mongoose");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.addItem = async (req, res) => {
  try {
    let { userData } = req;

    console.log(userData.userType);
    if (!userData || userData.userType != "manager")
      return res.status(403).json({ error: "unauthorized" });
    const {
      productName,
      productImage,
      productDescription,
      weight,
      quantity,
      price,
    } = req.body;

    if (!productName || !quantity || !price) {
      return res.status(400).json({ error: "Please provide required fields." });
    }

    const newItem = {
      productName,
      productImage,
      productDescription,
      weight,
      quantity,
      price,
    };

    let product = await Product.create(newItem);

    return res.status(201).json({
      message: "Product added to inventory successfully.",
      item: newItem,
    });
  } catch (er) {
    console.log(er);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    console.log("get hit");

    let product = await Product.find({}).sort({ createdAt: -1 });
    console.log("get hit");

    return res.status(201).json({
      message: "Product added to inventory successfully.",
      data: product,
    });
  } catch (er) {
    console.log(er);
    return res.status(501).json({
      message: "Product added to inventory successfully.",
      message: "Something went wrong...",
    });
  }
};

exports.getAvailableInventory = async (req, res) => {
  try {
    let data = await Product.getInventroy();

    return res
      .status(201)
      .json({ message: "Product added to inventory successfully.", data });
  } catch (er) {
    console.log(er);
    return res.status(501).json({
      message: "Product added to inventory successfully.",
      message: "Something went wrong...",
    });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    let productId = req.query.productId;
    let userId = req.userData._id;
    console.log(userId);
    let p = await Product.findOne({ _id: ObjectId(productId) });
    p.productId = p._id;
    delete p._id;
    delete p.createdAt;
    delete p.updatedAt;
    await Cart.updateOne(
      { userId: ObjectId(userId) },
      { $push: { products: p } },
      { upsert: true }
    );

    return res
      .status(201)
      .json({ message: "Product added to inventory successfully." });
  } catch (er) {
    console.log(er);
    return res.status(501).json({
      message: "Product added to inventory successfully.",
      message: "Something went wrong...",
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    let userId = req.userData._id;
    let cart = await Cart.findOne({ userId: ObjectId(userId) });

    return res.status(201).json({
      message: "Product added to inventory successfully.",
      data: (cart && cart.products) || [],
    });
  } catch (er) {
    console.log(er);
    return res.status(501).json({
      message: "Product added to inventory successfully.",
      message: "Something went wrong...",
    });
  }
};

exports.removeCart = async (req, res) => {
  try {
    let userId = req.userData._id;
    let productId = req.body.productId;
    let cart = await Cart.updateOne(
      { userId: ObjectId(userId), "products.productId": ObjectId(productId) },
      { $pull: { products: { productId: ObjectId(productId) } } }
    );

    return res.status(201).json({
      message: "Remove successfully.",
    });
  } catch (er) {
    console.log(er);
    return res.status(501).json({
      message: "Something went wrong...",
    });
  }
};
