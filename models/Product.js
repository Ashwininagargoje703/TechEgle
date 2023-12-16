const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    productDescription: {
      type: String,
    },
    weight: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.statics.getInventroy = async () => {
  let product = await Product.find(
    { isActive: true },
    { name: 1, quantity: 1 }
  ).sort({ createdAt: -1 });
  return product;
};
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
