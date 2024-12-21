const mongoose = require("mongoose");

// Định nghĩa schema
const DescribeSchema = new mongoose.Schema({
  id_material: {
    type: String,
    required: true,
    ref: "Course",
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM", "OVERVIEW"],
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
  overviewIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Overview" }],
});

// Tạo model
const Describe = mongoose.model("Describe", DescribeSchema);

module.exports = Describe;
