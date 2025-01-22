const mongoose = require("mongoose");

// Định nghĩa schema
const InteractionSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến bảng User
    required: true,
  },
  id_ref_material: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  ref_type: {
    type: String,
    enum: ["COURSE", "EXAM", "INTERACTION"],
    required: true,
  },
  type: {
    type: String,
    enum: ["COMMENT", "RATE"],
    required: true,
  },
  rate: {
    type: Number,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Interaction = mongoose.model("Interaction", InteractionSchema);

module.exports = Interaction;
