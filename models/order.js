const mongoose = require("mongoose");

// Định nghĩa schema
const OrderSchema = new mongoose.Schema({
  id_user: {
    type: Integer,
    required: true,
  },
  id_material: {
    type: Integer,
    required: true,
  },
  type: {
    type: String,
    enum: ["COURSE", "EXAM"],
    required: true,
  },
  payment_status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
