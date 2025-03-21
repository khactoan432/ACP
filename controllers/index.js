const {
  Comment,
  Interaction,
  Banner,
  Achievement,
  User,
  Course,
  Describe,
  Overview,
  Exercise,
  Topic,
  Lesson,
  Exam, CategoryType, Category,
  Advisory,
} = require("../models");

const mongoose = require("mongoose");

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInteractions = async (req, res) => {
  try {
    const { id_ref_material, ref_type, type } = req.query;

    // Kiểm tra nếu thiếu các trường bắt buộc
    if (!id_ref_material || !ref_type || !type) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    const idRefMaterialObjectId = new mongoose.Types.ObjectId(id_ref_material);

    // Sử dụng aggregate để tối ưu truy vấn
    const interactions = await Interaction.aggregate([
      {
        $match: { id_ref_material: idRefMaterialObjectId, ref_type, type },
      },
      {
        $lookup: {
          from: "users",
          localField: "id_user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "interactions",
          let: { interactionId: "$_id" }, // Biến tạm để truyền giá trị _id
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$id_ref_material", "$$interactionId"] }, // So khớp id_ref_material
                    { $eq: ["$ref_type", "INTERACTION"] }, // Lọc ref_type là "INTERACTION"
                  ],
                },
              },
            },
          ],
          as: "replies",
        },
      },
      {
        $unwind: {
          path: "$replies",
          preserveNullAndEmptyArrays: true, // Giữ giá trị null
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "replies.id_user",
          foreignField: "_id",
          as: "replies.user",
        },
      },
      {
        $unwind: {
          path: "$replies.user",
          preserveNullAndEmptyArrays: true, // Giữ giá trị null
        },
      },
      {
        $group: {
          _id: "$_id",
          id_user: { $first: "$id_user" },
          user_name: { $first: "$user.name" },
          ref_type: { $first: "$ref_type" },
          type: { $first: "$type" },
          rate: { $first: "$rate" },
          content: { $first: "$content" },
          createdAt: { $first: "$createdAt" },
          replies: {
            $push: {
              $cond: {
                if: { $ne: ["$replies", null] }, // Chỉ giữ giá trị không null
                then: {
                  _id: "$replies._id",
                  id_user: "$replies.id_user",
                  user_name: "$replies.user.name",
                  user_role: "$replies.user.role",
                  content: "$replies.content",
                  createdAt: "$replies.createdAt",
                },
                else: "$$REMOVE", // Bỏ qua giá trị null
              },
            },
          },
        },
      },
      {
        $addFields: {
          replies: {
            $filter: {
              input: "$replies",
              as: "reply",
              cond: { $ne: ["$$reply", {}] }, // Loại bỏ các object rỗng
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 }, // Sắp xếp giảm dần theo createdAt, đổi thành 1 để tăng dần
      },
      {
        $project: {
          id_user: 1,
          user_name: 1,
          ref_type: 1,
          type: 1,
          rate: 1,
          content: 1,
          createdAt: 1,
          replies: 1,
        },
      },
    ]);

    // Trả về kết quả
    return res.status(200).json({
      message: "Get Interactions successfully.",
      total: interactions.length,
      data: interactions,
    });
  } catch (err) {
    console.error("Error fetching interactions:", err); // Log lỗi để dễ debug
    return res.status(500).json({ error: "Internal Server Error" });
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
    const page = parseInt(req.query.page) || 1; // Default: page 1
    const limit = parseInt(req.query.limit) || 10; // Default: 10 records per page
    let filters = [];
    try {
      filters = JSON.parse(req.query.filters || "[]");
    } catch (err) {
      return res.status(400).json({ error: "Invalid filters format" });
    }

    console.log(filters);

    // Xây dựng query để kiểm tra tất cả các type trong filters
    const query = {};
    if (filters.length > 0) {
      query.$and = filters.map((filter) => ({
        categories: {
          $elemMatch: {
            type: filter.type,
            value: { $in: filter.value },
          },
        },
      }));
    }

    // Tổng số exam phù hợp với bộ lọc
    const total = await Exam.countDocuments(query);
    console.log(total);

    // Fetch exam với phân trang và bộ lọc
    const exams = await Exam.find(query)
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo
      .skip((page - 1) * limit)
      .limit(limit);

    // Trả về kết quả
    res.status(200).json({
      message: "Get Exams successfully.",
      total,
      data: exams,
    });
  } catch (err) {
    console.error("Error fetching filtered exams:", err);
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

exports.getCategories = async (req, res) => {
  try {
    // Truy vấn tất cả CategoryType và các Category liên quan qua categoryIds
    const categoryTypes = await CategoryType.find().populate("categoryIds"); // populate đúng tên trường

    if (!categoryTypes || categoryTypes.length === 0) {
      return res
        .status(200)
        .json({ message: "No CategoryTypes found", data: [] });
    }

    const formattedCategoryTypes = categoryTypes.map((categoryType) => ({
      ...categoryType.toObject(),
      value: categoryType.categoryIds, // Đổi tên trường từ categoryIds thành value
    }));

    return res.status(200).json({
      message: "CategoryTypes fetched successfully.",
      data: formattedCategoryTypes,
    });
  } catch (err) {
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
