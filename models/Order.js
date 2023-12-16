var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const newSchema = new Schema(
  {
    name: { type: String },
    phoneNumber: { type: String, required: true },
    products: Array,
    totalMrp: Number,
    payableAmount: Number,
    status: Number,
    address: {},
    orderId: Number,
    paymentMode: String,
    userId: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

newSchema.statics.getOrderId = async () => {
  let lastOrder = await Order.findOne({}).sort({ orderId: -1 });
  if (lastOrder && lastOrder.orderId) {
    return lastOrder.orderId + 1;
  }
  return 1000;
};
const Order = mongoose.model("orders", newSchema);
module.exports = Order;
