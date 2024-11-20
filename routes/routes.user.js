const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");

// router.get("/", userController.getAllUsers);
// router.post("/", userController.createUser);
// router.get("/:id", userController.getUserById);
// router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);

module.exports = router;

// const express = require("express");
// const User = require("../models/user");

// const router = express.Router();

// // Route: Lấy tất cả người dùng
// router.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Route: Thêm người dùng mới
// router.post("/users", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Kiểm tra nếu email đã tồn tại
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email đã tồn tại" });
//     }

//     // Tạo người dùng mới
//     const newUser = new User({ name, email, password });
//     await newUser.save();

//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Route: Xóa người dùng theo ID
// router.delete("/users/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     await User.findByIdAndDelete(userId);
//     res.status(200).json({ message: "Đã xóa người dùng thành công" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
