const express = require("express"); 
const userRoutes = require("./routes/userRoutes"); 
const mongoose = require("mongoose");
const dbConfig = require("./config/dbConfig");
const cors = require("cors");

const app = express();

 
app.use(cors());
app.use(express.json());

mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
app.use("/api/users", userRoutes);

module.exports = app;
