// CategoryTypeModel.js
const mongoose = require("mongoose");

// Định nghĩa schema cho CategoryType
const CategoryTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  option: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // Liên kết với Category
});

// Đăng ký mô hình "CategoryType"
const CategoryType = mongoose.model("CategoryType", CategoryTypeSchema);

module.exports = CategoryType;
