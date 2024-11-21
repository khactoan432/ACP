const mongoose = require("mongoose");

// Định nghĩa schema
const CommentSchema = new mongoose.Schema({
  id_user: {
    type: String,
    required: true,
  },
  id_commented: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM","COMMENT"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Tạo model
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
