var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment");
const secretKey = "Ashwini";
const bcrypt = require("bcrypt");

const newSchema = new Schema(
  {
    name: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true, trim: true },
    userType: { type: String, enum: ["Customer", "manager"] },
    isActive: { type: Boolean, default: true },
    emailId: String,
    city: { type: String },
    state: { type: String },
  },
  {
    timestamps: true,
  }
);

newSchema.statics.generateAuthToken = async (phoneNumber) => {
  let payload = phoneNumber + " " + crypto.randomBytes(20).toString("hex");
  let token = await jwt.sign({ payload }, secretKey, { expiresIn: "30m" });
  let expiredTime = moment().add(30, "minutes").toDate();
  return { token, expiredTime };
};

const Admin = mongoose.model("Admin", newSchema);
module.exports = Admin;
