const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// 📌 Create a new order after payment
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentId } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentId,
      paymentStatus: "Paid", // Mark as paid after successful payment
    });

    await newOrder.save();
    res.status(201).json({ message: "Order stored successfully", order: newOrder });
  } catch (error) {
    console.error("Error storing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
