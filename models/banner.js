const mongoose = require("mongoose");

// Định nghĩa schema
const BannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Banner = mongoose.model("Banner", BannerSchema);

module.exports = Banner;
