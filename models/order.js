const mongoose = require("mongoose");

// Định nghĩa schema
const OrderSchema = new mongoose.Schema({
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
