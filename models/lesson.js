const mongoose = require("mongoose");

// Định nghĩa schema
const LessonSchema = new mongoose.Schema({
  id_topic: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Topic",
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
    enum: ["PUBLIC", "PRIVATE"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  exerciseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
});

// Tạo model
const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
