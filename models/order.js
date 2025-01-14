const mongoose = require("mongoose");

// Định nghĩa schema
const OrderSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  id_material: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM"],
    required: true,
  },
  method: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
