import express from "express";
import { createOrder } from "../controllers/paymentController.js";

const router = express.Router();

// Route to create a payment order
router.post("/", createOrder);

export default router;
