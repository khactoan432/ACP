const mongoose = require("mongoose");

// Định nghĩa schema
const AchievementSchema = new mongoose.Schema({
  email_user: {
    type: String,
    required: true,
  },
  prize: {
    type: String,
    required: true,
  },
  competition: {
    type: String,
    required: true,
  },
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
const Achievement = mongoose.model("Achievement", AchievementSchema);

module.exports = Achievement;
