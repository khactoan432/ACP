const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://ACP:E4vQAb1d8Vo4tbjv@acp.hplft.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Dừng server nếu không kết nối được
  }
};

module.exports = connectDB;
