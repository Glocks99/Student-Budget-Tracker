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

const allowedOrigins = ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
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
