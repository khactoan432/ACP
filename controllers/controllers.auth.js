const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validNameCodeforce, validUser } = require("../helpers/validations");

class AuthController {
  async registerController(req, res) {
    try {
      const {
        name,
        image,
        email,
        password,
        repassword,
        phone_number,
        codeforce_name,
        role,
      } = req.body;

      // Validation
      try {
        const validationNameCodeforce = await validNameCodeforce(
          codeforce_name
        );
        if (!validationNameCodeforce) {
          return res
            .status(400)
            .json({ error: "Tên codeforce của bạn không tồn tại." });
        }
      } catch (error) {
        return res.status(500).json({ error: "Lỗi khi kiểm tra email." });
      }

      const validationUser = await validUser(email);
      if (validationUser) {
        return res.status(400).json({ error: "Email đã tồn tại." });
      }
      if (password !== repassword) {
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

      res.status(201).json({
        message: "Đăng ký thành công",
        data: `Email: ${newUser.email}`,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  //
  async loginController(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email và mật khẩu là bắt buộc." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Email hoặc mật khẩu không đúng." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ error: "Email hoặc mật khẩu không đúng." });
      }

      // JWT token
      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Đăng nhập thành công",
        user: {
          name: user.name,
          image: user.image,
          email: user.email,
          phone_number: user.phone_number,
          codeforce_name: user.codeforce_name,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }
  }

  logoutController(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Lỗi khi xóa session:", err);
          return res.status(500).json({ error: "Không thể logout." });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Đăng xuất thành công." });
      });
    } catch (error) {
      console.error("Lỗi logout:", error);
      return res.status(500).json({ error: "Đã xảy ra lỗi khi logout." });
    }
  }
}

module.exports = new AuthController();
