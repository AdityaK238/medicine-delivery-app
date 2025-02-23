const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
require("dotenv").config();
const fs = require("fs");
const Order = require("./models/Order"); // ✅ Import Order model from models/Order
const axios = require("axios");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

require("dotenv").config();
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

let orderLocations = {}; // Store order locations dynamically

// 🔹 MongoDB Connection

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));



async function getCoordinates(address) {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${googleMapsApiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      return response.data.results[0].geometry.location; // { lat, lng }
    } else {
      throw new Error("Address not found");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Example Usage:
getCoordinates("Mumbai, India").then((location) => console.log(location));





// 🔹 Medicine Schema & Model
const medicineSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  description: String,
});

const Medicine = mongoose.model("Medicine", medicineSchema);

// 🔹 Load Medicines from JSON into MongoDB (Run Once)
async function loadMedicines() {
  try {
    const medicinesData = JSON.parse(
      fs.readFileSync(__dirname + "/data/medicines.json", "utf-8")
    );

    for (const medicine of medicinesData) {
      const existing = await Medicine.findOne({ name: medicine.name });
      if (!existing) {
        await new Medicine(medicine).save();
      }
    }
    console.log("✅ Medicines Loaded into Database");
  } catch (error) {
    console.error("❌ Error Loading Medicines:", error);
  }
}
loadMedicines();

// 🔹 Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/create-order", async (req, res) => {
  try {
    let { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid payment amount!" });
    }

    console.log("Received amount from frontend (in Rupees):", amount);

    const amountInPaise = parseInt(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay Order Created:", order);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("❌ Error Creating Order:", error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
});

// 🔹 Store Orders in Database
app.post("/api/orders", async (req, res) => {
  try {
    const { orderId, transactionId, amount, medicines } = req.body;

    if (!orderId || !transactionId || !amount || !medicines || medicines.length === 0) {
      return res.status(400).json({ success: false, error: "Missing order details!" });
    }

    const newOrder = new Order({
      orderId,
      transactionId,
      amount,
      medicines,
    });

    await newOrder.save();

    io.emit("orders", await Order.find());
    res.status(201).json({ message: "Order stored successfully" });
  } catch (error) {
    console.error("❌ Error storing order:", error);
    res.status(500).json({ error: "Failed to store order" });
  }
});

// 🔹 Fetch Orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, error: "No orders found!" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🔹 WebSocket Handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  Order.find().then((orders) => socket.emit("orders", orders));

  socket.on("updateLocation", async ({ orderId, lat, lng }) => {
    try {
      await Order.findOneAndUpdate({ orderId }, { location: { lat, lng } });
      console.log(`Updated location for order ${orderId}:`, lat, lng); // ✅ Fixed Syntax Error
      io.emit("locationUpdate", { orderId, lat, lng });
    } catch (err) {
      console.error("Error updating location:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔹 API to Get Order Location
app.get("/api/tracking", async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const order = await Order.findOne({ orderId });

    if (!order || !order.location) {
      return res.status(404).json({ error: "Order not found or no location available" });
    }

    res.status(200).json({ orderId, location: order.location });
  } catch (error) {
    console.error("❌ Error fetching order location:", error);
    res.status(500).json({ error: "Failed to fetch order location" });
  }
});

// 🔹 Start Server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
