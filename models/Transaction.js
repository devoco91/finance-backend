// models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ["credit", "debit"], required: true },
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now },
  reference: { type: String, required: true },
  status: { type: String, default: "Completed" }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
