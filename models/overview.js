const mongoose = require("mongoose");

// Định nghĩa schema
const OverviewSchema = new mongoose.Schema({
  id_material: {
    type: Integer,
    required: true,
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM"],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
  },
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
const Overview = mongoose.model("Overview", OverviewSchema);

module.exports = Overview;
