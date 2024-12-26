const mongoose = require("mongoose");

// Định nghĩa schema
const CategorySchema = new mongoose.Schema({
  category_type_id: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
