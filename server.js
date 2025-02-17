require("dotenv").config();
const fileUpload = require("express-fileupload");
const express = require("express");
const redis = require('redis')
const session = require('express-session')
const cors = require("cors");
const bodyParser = require("body-parser");

const errorMiddleware = require("./middlewares/errorMiddleware");
const loggerMiddleware = require("./middlewares/loggerMiddleware");

// Kết nối MongoDB
const connectDB = require("./configs/configDB");
connectDB(); // Kết nối MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "toantriACP", // Khóa bí mật để mã hóa session
    resave: false, // Không lưu lại session nếu không thay đổi
    saveUninitialized: false, // Không tạo session mới nếu không cần
    cookie: {
      maxAge: 3600000, // Thời gian sống của cookie (1 giờ)
      httpOnly: true, // Chỉ cho phép truy cập qua HTTP (bảo mật)
    },
  })
);

// Routes
app.use(loggerMiddleware);
const apiRoutes = require("./routes");
app.use("/api", apiRoutes);

app.use(errorMiddleware);
// Server
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
