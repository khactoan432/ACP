const mongoose = require("mongoose");

// Định nghĩa schema
const ExamSchema = new mongoose.Schema({
  id_user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Exam = mongoose.model("Exam", ExamSchema);

module.exports = Exam;
