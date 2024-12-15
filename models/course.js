const mongoose = require("mongoose");

// Định nghĩa schema
const CourseSchema = new mongoose.Schema({
  id_user: {
    type: String,
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
  video: {
    type: String,
    required: false,
  },
  price: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  describeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Describe" }],
});

// Tạo model
const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
