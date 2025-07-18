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

const allowedOrigins = process.env.NODE_ENV === 'production' ? [
  'https://bank-frontend-chi.vercel.app',
  'https://www.wavesfinance.org',
  'https://wavesfinance.org',
] : [
  'http://localhost:5173',  // Allow local dev origin
  'https://bank-frontend-chi.vercel.app',
  'https://www.wavesfinance.org',
  'https://wavesfinance.org',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

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
