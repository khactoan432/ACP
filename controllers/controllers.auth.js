const bcrypt = require("bcrypt");
const { User } = require("../models");
const { validNameCodeforce, validUser } = require("../helpers/validations");

const registerController = async (req, res) => {
  try {
    const {
      name,
      image,
      email,
      password,
      repasswork,
      phone_number,
      codeforce_name,
      role,
    } = req.body;

    if (!validNameCodeforce(name)) {
      return res
        .status(400)
        .json({ error: "Tên codeforce của bạn không tồn tại." });
    }
    if (!validUser(email)) {
      return res.status(400).json({ error: "Email đã tồn tại." });
    }
    if (password !== repasswork) {
      return res.status(400).json({ error: "Mật khẩu không trùng khớp." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      image,
      email,
      password: hashedPassword,
      phone_number,
      codeforce_name,
      role,
    });
    await newUser.save();

    console.log(newUser.email);
    res.status(201).json({
      message: "Đăng ký thành công",
      data: `Email: ${newUser.email}`,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
const loginController = (req, res) => {
  // const { username, password } = req.body;
  // // query table users, get username, password
  // const userName = ;
  // const password = '';
  // if (username === 'admin' && password === 'password') {
  //     // Lưu thông tin người dùng vào session
  //     req.session.user = {
  //         id: 1,
  //         username: 'admin',
  //         role: 'admin',
  //     };
  //     return res.json({ message: 'Đăng nhập thành công!' });
  // }
  // res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' });
};
const logoutController = () => {};

module.exports = {
  registerController: registerController,
};