const mongoose = require("mongoose");

// Định nghĩa schema
const CourseSchema = new mongoose.Schema({
  id_user: {
    type: Integer,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Integer,
    required: true,
  },
  discount: {
    type: Integer,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
