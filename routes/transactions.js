// routes/transactions.js
const express = require("express");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get latest 10 transactions
router.get("/", auth, async (req, res) => {
  const txns = await Transaction.find({ userId: req.userId }).sort({ date: -1 }).limit(10);
  res.json(txns);
});

// Create transaction + update balance
router.post("/", auth, async (req, res) => {
  const { type, amount, description, reference } = req.body;
  if (!["credit", "debit"].includes(type) || !amount || !reference) {
    return res.status(400).json({ error: "Invalid transaction data" });
  }

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const txn = await Transaction.create({ userId: req.userId, type, amount, description, reference });

  const amt = Number(amount);
  if (type === "credit") user.totalAmount += amt;
  else if (type === "debit") user.totalAmount -= amt;

  await user.save();
  res.status(201).json(txn);
});

// Update transaction + adjust balance
router.put("/:id", auth, async (req, res) => {
  const oldTxn = await Transaction.findOne({ _id: req.params.id, userId: req.userId });
  if (!oldTxn) return res.status(404).json({ error: "Transaction not found" });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const oldAmt = Number(oldTxn.amount);
  if (oldTxn.type === "credit") user.totalAmount -= oldAmt;
  else if (oldTxn.type === "debit") user.totalAmount += oldAmt;

  const { type, amount, description, reference } = req.body;
  const newAmt = Number(amount);
  if (type === "credit") user.totalAmount += newAmt;
  else if (type === "debit") user.totalAmount -= newAmt;

  await user.save();

  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    { type, amount, description, reference },
    { new: true }
  );

  res.json(updated);
});

// Delete transaction + revert balance
router.delete("/:id", auth, async (req, res) => {
  const txn = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (txn) {
    const user = await User.findById(req.userId);
    if (user) {
      const amt = Number(txn.amount);
      if (txn.type === "credit") user.totalAmount -= amt;
      else if (txn.type === "debit") user.totalAmount += amt;
      await user.save();
    }
  }
  res.status(204).end();
});

module.exports = router;
