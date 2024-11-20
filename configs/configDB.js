const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://ACP:E4vQAb1d8Vo4tbjv@acp.hplft.mongodb.net/ACP?retryWrites=true&w=majority";
    await mongoose.connect(mongoURI); // Không cần các tùy chọn useNewUrlParser, useUnifiedTopology
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
