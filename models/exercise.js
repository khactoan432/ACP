const mongoose = require("mongoose");

// Định nghĩa schema
const ExerciseSchema = new mongoose.Schema({
  id_lesson: {
    type: String,
    required: true,
    ref: "Lesson",
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
  score: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
