// ✅ FINAL FIXED VERSION: routes/user.js
const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

router.put("/total-amount", auth, async (req, res) => {
  const { totalAmount } = req.body;
  const user = await User.findByIdAndUpdate(req.userId, { totalAmount }, { new: true });
  res.json({ totalAmount: user.totalAmount });
});

router.get("/dashboard", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const transactions = await Transaction.find({ userId: req.userId })
    .sort({ date: -1 })
    .limit(10);
  const totalTransactions = await Transaction.countDocuments({ userId: req.userId });

  res.json({
    accountNo: user.accountNo,
    accountNumber: user.accountNumber,
    accountType: user.accountType,
    totalAmount: user.totalAmount,
    totalTransactions,
    transactions
  });
});

module.exports = router;
