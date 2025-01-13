const {
  Comment,
  Rate,
  Banner,
  Achievement,
  User,
  Course,
  Describe,
  Overview,
  Exercise,
  Topic,
  Lesson,
  Exam,
  Advisory,
} = require("../models");

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
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      message: "Get banners successfully.",
      total: totalBanners,
      data: banners,
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
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      message: "Get achievements successfully.",
      total: totalAchievements,
      data: achievements,
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
      data: users,
    });
  } catch (err) {
    console.error("Error fetching paginated users:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit); // Default: 10 (fetch 10 records)

    const totals = await Course.countDocuments();

    const courses = await Course.find()
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      message: "Get courses successfully.",
      total: totals,
      data: courses,
    });
  } catch (err) {
    console.error("Error fetching paginated courses:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const structCourse = {};

    // Lấy thông tin khóa học
    const course = await Course.findById(id).lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    structCourse.course = JSON.parse(JSON.stringify(course));

    const describesData = await Describe.find({ id_material: id }).lean();
    let describes = JSON.parse(JSON.stringify(describesData)); // copy deep dataDescription

    if (describes.length > 0) {
      const describeIds = describes.map((d) => d._id.toString());
      const allOverviews = await Overview.find({
        id_material: { $in: describeIds },
      }).lean();

      describes.forEach((d) => {
        d.overviews = allOverviews.filter(
          (o) => o.id_material.toString() === d._id.toString()
        );
      });
    }

    const topicsData = await Topic.find({ id_course: id }).lean();
    let topics = JSON.parse(JSON.stringify(topicsData));

    if (topics.length > 0) {
      const topicIds = topics.map((t) => t._id.toString());

      const allLessons = await Lesson.find({
        id_topic: { $in: topicIds },
      }).lean();

      const lessonIds = allLessons.map((l) => l._id.toString());
      const allExercises = await Exercise.find({
        id_lesson: { $in: lessonIds },
      }).lean();

      topics.forEach((t) => {
        t.lessons = allLessons
          .filter((l) => l.id_topic === t._id.toString())
          .map((l) => ({
            ...l,
            exercise: allExercises.filter(
              (e) => e.id_lesson === l._id.toString()
            ),
          }));
      });
    }

    structCourse.course.describes = describes;
    structCourse.course.topics = topics;

    res.status(200).json({
      data: structCourse,
      message: "Get course detail successfully!",
    });
  } catch (err) {
    console.error(err.message);
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
    const page = parseInt(req.query.page) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit); // Default: 10 (fetch 10 records)

    const totals = await Exam.countDocuments();

    const exams = await Exam.find()
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      message: "Get Exams successfully.",
      total: totals,
      data: exams,
    });
  } catch (err) {
    console.error("Error fetching paginated exams:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getExamDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const structExam = {};

    // Lấy thông tin khóa học
    const exam = await Exam.findById(id).lean();
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    structExam.exam = JSON.parse(JSON.stringify(exam));

    const describesData = await Describe.find({ id_material: id }).lean();
    let describes = JSON.parse(JSON.stringify(describesData)); // copy deep dataDescription

    if (describes.length > 0) {
      const describeIds = describes.map((d) => d._id.toString());
      const allOverviews = await Overview.find({
        id_material: { $in: describeIds },
      }).lean();

      describes.forEach((d) => {
        d.overviews = allOverviews.filter(
          (o) => o.id_material.toString() === d._id.toString()
        );
      });
    }

    structExam.exam.describes = describes;

    res.status(200).json({
      data: structExam,
      message: "Get Exam detail successfully!",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// advisory user

exports.createAdvisory = async (req, res) => {
  try {
    const { name, email, phone_number, mindfulness_course } = req.body;
    console.log("name: " + name);
    console.log("email: " + email);
    console.log("phone_number: " + phone_number);
    console.log("mindfulness_course: " + mindfulness_course);

    if (!name || !email || !phone_number || !mindfulness_course) {
      return res.status(400).json({
        message:
          "Missing required name | email | phone_number | mindfulness_course ",
      });
    }

    const newAdvisory = await Advisory.create({
      name,
      email,
      phone_number,
      mindfulness_course,
    });

    return res.status(200).json({
      message: "Advisory created successfully.",
      data: newAdvisory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
