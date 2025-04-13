const express = require("express");
// const mysql = require("mysql2");
const userRoutes = require("./routes/userRoutes");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const dbConfig = require("./config/dbConfig");
const cors = require("cors");

const app = express();

// app.use(bodyParser);
app.use(cors());
app.use(express.json());

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = app;

app.use("/api/users", userRoutes);


// const db = mysql.createConnection(dbConfig);

// db.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Mysql connected");
//   }
// });
