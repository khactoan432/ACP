const mongoose = require("mongoose");

// Định nghĩa schema
const AdvisorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mindfulness_course: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Advisory = mongoose.model("Advisory", AdvisorySchema);

module.exports = Advisory;
