const mongoose = require("mongoose");

// Định nghĩa schema
const RegisterSchema = new mongoose.Schema({
  id_user: {
    type: String,
    required: true,
  },
  id_material: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Register = mongoose.model("Register", RegisterSchema);

module.exports = Register;
