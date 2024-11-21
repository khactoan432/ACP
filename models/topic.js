const mongoose = require("mongoose");

// Định nghĩa schema
const TopicSchema = new mongoose.Schema({
  id_course: {
    type: Number,
    required: true,
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
});

// Tạo model
const Topic = mongoose.model("Topic", TopicSchema);

module.exports = Topic;
