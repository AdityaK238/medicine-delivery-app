const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  medicines: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
