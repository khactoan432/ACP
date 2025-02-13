const mongoose = require("mongoose");

// Định nghĩa schema
const TopicSchema = new mongoose.Schema({
  id_course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lessonIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
});

// Tạo model
const Topic = mongoose.model("Topic", TopicSchema);

module.exports = Topic;
