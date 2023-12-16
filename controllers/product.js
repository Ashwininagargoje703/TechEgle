const mongoose = require("mongoose");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Response = require("../service/Response");

exports.addItem = async (req, res) => {
  try {
    let { userData } = req;

    console.log(userData.userType);
    if (!userData || userData.userType != "manager")
      return res.status(403).json({ error: "unauthorized" });
    const { title, imageUrl, productDescription, weight, quantity, price } =
      req.body;

    if (!title || !quantity || !price) {
      return res.status(400).json({ error: "Please provide required fields." });
    }

    const newItem = {
      title,
      imageUrl,
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

    let product = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });
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
    let productId = req.query.productId;
    console.log("id", productId);
    let cart = await Cart.updateOne(
      { userId: ObjectId(userId), "products._id": ObjectId(productId) },
      { $pull: { products: { _id: ObjectId(productId) } } }
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

exports.updateInventroy = async (req, res) => {
  try {
    let userData = req.userData;
    let products = req.body.products;
    console.log(products);
    if (!userData || userData.userType != "manager")
      return res.status(403).json({ error: "unauthorized" });

    for (let p of products) {
      console.log(p);
      await Product.updateOne(
        { _id: ObjectId(p._id) },
        { $inc: { quantity: p.quantity } }
      );
    }
    return res.status(201).json(Response(false, "added successfully"));
  } catch (er) {
    console.log(er);
    return res.status(500).json(Response(false, "Something went wrong..."));
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let userData = req.userData;
    let productId = req.params.id;
    console.log(userData);
    if (!userData || userData.userType != "manager")
      return res.status(403).json({ error: "unauthorized" });

    await Product.updateOne(
      { _id: ObjectId(p._id) },
      { $set: { isActive: false } }
    );

    return res.status(201).json(Response(false, "removed successfully"));
  } catch (er) {
    console.log(er);
    return res.status(500).json(Response(false, "Something went wrong..."));
  }
};
