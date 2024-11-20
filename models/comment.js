const mongoose = require("mongoose");

// Định nghĩa schema
const CommentSchema = new mongoose.Schema({
  id_user: {
    type: Integer,
    required: true,
  },
  id_Commented: {
    type: Integer,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Tạo model
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
