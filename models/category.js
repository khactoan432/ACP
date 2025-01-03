// CategoryModel.js
const mongoose = require("mongoose");

// Định nghĩa schema cho Category
const CategorySchema = new mongoose.Schema({
  category_type_id: {
    type: mongoose.Schema.Types.ObjectId, // Sử dụng ObjectId thay vì String
    required: true,
    ref: "CategoryType", // Liên kết với CategoryType
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

// Đăng ký mô hình "Category"
const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
