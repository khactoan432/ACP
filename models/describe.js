const mongoose = require("mongoose");

// Định nghĩa schema
const DescribeSchema = new mongoose.Schema({
  id_material: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM","OVERVIEW"],
    required: true,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Describe = mongoose.model("Describe", DescribeSchema);

module.exports = Describe;
