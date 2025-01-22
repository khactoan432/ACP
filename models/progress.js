const mongoose = require("mongoose");

// Định nghĩa schema
const ProgressSchema = new mongoose.Schema({
  id_user: {
    type: String,
    required: true,
  },
  id_course: {
    type: String,
    required: true,
  },
  id_lesson: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Progress = mongoose.model("Progress", ProgressSchema);

module.exports = Progress;
