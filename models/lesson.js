const mongoose = require("mongoose");

// Định nghĩa schema
const LessonSchema = new mongoose.Schema({
  id_topic: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  video: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
