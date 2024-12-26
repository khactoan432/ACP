const mongoose = require("mongoose");

// Định nghĩa schema
const CategoryTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const CategoryType = mongoose.model("CategoryType", CategoryTypeSchema);

module.exports = CategoryType;
