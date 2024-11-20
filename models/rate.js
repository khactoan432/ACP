const mongoose = require("mongoose");

// Định nghĩa schema
const RateSchema = new mongoose.Schema({
  rate: {
    type: Integer,
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
