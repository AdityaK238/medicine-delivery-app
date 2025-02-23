const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, 
  usage: { type: String, required: true },
  dose: { type: String, required: true },
  sideEffects: { type: String, required: true },
  warnings: { type: String, required: true },
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
