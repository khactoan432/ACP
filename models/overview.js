const mongoose = require("mongoose");

// Định nghĩa schema
const OverviewSchema = new mongoose.Schema({
  id_material: {
    type: String,
    required: true,
    ref: "Describe",
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM"],
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
const Overview = mongoose.model("Overview", OverviewSchema);

module.exports = Overview;
