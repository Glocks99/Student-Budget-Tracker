const express = require("express");
require("./models/db");
const cors = require("cors");
const dotenv = require("dotenv");
const transRoute = require("./routes/trans_route");
const authRoute = require("./routes/authroute");
const userRoute = require("./routes/user_route");
dotenv.config();
const cookieParser = require("cookie-parser");

const app = express();

const allowedOrigins = [
  "https://student-budget-tracker.vercel.app",
  "https://student-budget-tracker.onrender.com",
  "http://localhost:5173", // For local development
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/trans", transRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("api is working");
});

app.listen(process.env.PORT, () => console.log("server is running"));
