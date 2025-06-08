// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  accountNo: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  totalAmount: { type: Number, default: 0 },
  accountType: { type: String, default: "Checking Account" },
  accountNumber: { type: String, required: true }
});

module.exports = mongoose.model("User", UserSchema);
