const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      // "mongodb+srv://cheeku:1234@cluster0.rrx7pc4.mongodb.net/manijment-api",
      "mongodb+srv://cheeku:1234@cluster0.rrx7pc4.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;
// mongodb+srv://<username>:<password>@cluster0.rrx7pc4.mongodb.net/?retryWrites=true&w=majority
