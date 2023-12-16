const mongoose = require("mongoose");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Response = require("../service/Response");

exports.createOrder = async (req, res) => {
  try {
    let { userData } = req;
    let { products, address, paymentMode } = req.body;
    console.log(products, address, paymentMode);
    let mrp = 0,
      totalPayable = 0,
      finalProducts = [];
    let obj = {
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      address,
      orderId: await Order.getOrderId(),
      paymentMode,
      status: 1,
      userId: ObjectId(userData._id),
    };
    for (let o of products) {
      let [p, inv] = await Promise.all([
        Product.findOne({ _id: ObjectId(o._id) }).lean(),
        Product.updateOne(
          { _id: ObjectId(o._id) },
          { $inc: { quantity: o.quantity * -1 } }
        ),
      ]);
      mrp += o.quantity * p.price;
      totalPayable += o.quantity * o.price;
      o.title = p.title;
      o.productId = p._id;
      o.subTotal = o.quantity * o.price;
      o.costPrice = o.quantity * p.price;
    }
    obj.totalMrp = mrp;
    obj.payableAmount = totalPayable;
    obj.products = products;
    let order = await Order.create(obj);
    console.log(obj);
    // return res.json(Response(false, obj));
    obj.products = products;
    await Cart.updateOne(
      { userId: ObjectId(userData._id) },
      { Set: { products: [] } }
    );
    return res.status(200).send(Response(false, order));
  } catch (er) {
    console.log(er);
    return res.status(500).json(Response(true, "something went wrong.."));
  }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    let { userData } = req;
    if (!userData || userData.userType != "manager")
      return res.status(403).json({ error: "unauthorized" });

    let { orderId, status } = req.body;

    await Order.updateOne({ _id: ObjectId(orderId) }, { $set: { status } });

    return res
      .status(200)
      .send(Response(false, "Order status change successfully"));
  } catch (er) {
    console.log(er);
    return res.status(500).json(Response(true, "something went wrong.."));
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    let { userData } = req;

    let orders = await Order.find({ userId: ObjectId(userData._id) });

    return res.status(200).send(Response(false, orders));
  } catch (er) {
    console.log(er);
    return res.status(500).json(Response(true, "something went wrong.."));
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    let id = req.params.id;

    let order = await Order.find({ _id: ObjectId(id) });

    return res.status(200).send(Response(false, order));
  } catch (er) {
    console.log(er);
    return res.status(500).json(Response(true, "something went wrong.."));
  }
};
