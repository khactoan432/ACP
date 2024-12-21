const { Comment, Rate, Banner, Achievement, User, Course, Topic, Lesson, Exam } = require("../models");

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRates = async (req, res) => {
  try {
    const rates = await Rate.find();
    res.status(200).json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)

    // Tính số lượng banners
    const totalBanners = await Banner.countDocuments();

    const banners = await Banner.find()
      .sort({ createdAt: 1 })
      .skip((page-1)*limit)
      .limit(limit);
    res.status(200).json({
      message: "Get banners successfully.",
      total: totalBanners, 
      data: banners
    });
  } catch (err) {
    console.error("Error fetching paginated banners:", err);
    res.status(500).json({ err: err.message });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)

    // Tính số lượng
    const totalAchievements = await Achievement.countDocuments();

    const achievements = await Achievement.find()
      .sort({ createdAt: 1 })
      .skip((page-1)*limit)
      .limit(limit);
    res.status(200).json({
      message: "Get achievements successfully.",
      total: totalAchievements, 
      data: achievements
    });
  } catch (err) {
    console.error("Error fetching paginated achievements:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const role = req.query.role || "";
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)

    // Tính số lượng người dùng có role
    const totalTeachers = await User.countDocuments({ role: role });

    // Lấy danh sách người dùng với role
    const users = await User.find({ role: role })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Get users successfully.", 
      total: totalTeachers, 
      data: users 
    });
  } catch (err) {
    console.error("Error fetching paginated users:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
