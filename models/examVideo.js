const mongoose = require("mongoose");

// Định nghĩa schema
const ExamVideoSchema = new mongoose.Schema({
  id_exam: {
    type: String,
    required: true,
    ref: "Exam",
  },
  describe: {
    type: String,
    required: false,
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
const ExamVideo = mongoose.model("ExamVideo", ExamVideoSchema);

module.exports = ExamVideo;
