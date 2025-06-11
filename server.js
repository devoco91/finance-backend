if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/user");

const app = express();

const allowedOrigins = [
  'https://bank-frontend-chi.vercel.app',
  'https://www.wavesfinance.org',
  'https://wavesfinance.org',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/user", userRoutes);

app.get("/", (_, res) => res.send("✅ Backend is running"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
