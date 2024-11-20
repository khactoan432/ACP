require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Kết nối MongoDB
const connectDB = require("./configs/configDB");
connectDB(); // Kết nối MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const indexRoutes = require("./routes/user");
app.use("/", indexRoutes);

// Server
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
console.log("Environment: ", process.env.NODE_ENV);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
