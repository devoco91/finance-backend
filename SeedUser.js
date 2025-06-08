// seedUser.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI);

  console.log("Clearing all users...");
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("Chands", 10);

  const user = new User({
    accountNo: "8632107640",
    accountNumber: "8632107640",
    passwordHash,
    totalAmount: 1000000,
    accountType: "Checking Account",
    username: "Williams Chandler"
  });

  await user.save();
  console.log("User seeded");
  await mongoose.disconnect();
}

seed();
