const mongoose = require("mongoose");

// Định nghĩa schema
const RateSchema = new mongoose.Schema({
  id_user: {
    type: String,
    required: true,
  },
  id_rated: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM"],
    required: true,
  },
  rate: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Rate = mongoose.model("Rate", RateSchema);

module.exports = Rate;
