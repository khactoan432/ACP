const { default: mongoose } = require("mongoose");
const {
  Comment,
  Interaction,
  Progress,
  Course,
  Topic,
  Lesson,
  Exam,
  Order,
} = require("../models");

exports.getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)

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

exports.getExams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)

    const totals = await Exam.countDocuments();

    const exams = await Exam.find()
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      message: "Get courses successfully.",
      total: totals,
      data: exams,
    });
  } catch (err) {
    console.error("Error fetching paginated exams:", error);
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

exports.getOrderCourse = async (req, res) => {
  try {
    const orderCourse = await Order.find();
    res.status(200).json(orderCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrderCourse = async (req, res) => {
  try {
    const { id_user, id_material, type } = req.body;
    const newOrder = new Order({ id_user, id_material, type });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrderExam = async (req, res) => {
  try {
    const orderExam = await Order.find();
    res.status(200).json(orderExam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrderExam = async (req, res) => {
  try {
    const { id_user, id_material, type } = req.body;
    const newOrder = new Order({ id_user, id_material, type });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { id_user, id_commented, type, content } = req.body;
    const newComment = new Comment({ id_user, id_commented, type, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find Comment by ID and update
    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Comment by ID and delete
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createInteraction = async (req, res) => {
  try {
    const { id_user, id_ref_material, ref_type, type, rate, content } = req.body;
    const newInteraction = new Interaction({ id_user, id_ref_material, ref_type, type, rate, content });
    await newInteraction.save();
    res.status(201).json({data: newInteraction});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find Interaction by ID and update
    const updatedInteraction = await Interaction.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedInteraction) {
      return res.status(404).json({ message: "Interaction not found" });
    }

    res.status(200).json(updatedInteraction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInteraction = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Interaction by ID and delete
    const deletedInteraction = await Interaction.findByIdAndDelete(id);

    if (!deletedInteraction) {
      return res.status(404).json({ message: "Interaction not found" });
    }

    res.status(200).json({ message: "Interaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBuyedMaterial = async (req, res) => {
  try {
    const {id_user} = req.query;
    // console.log(id_user, id_course);
    if(!id_user) {
      return res.status(404).json({message: "Fields are require!"})
    }
    const orderCourse = await Order.aggregate([
      { $match: { payment_status: "paid", id_user: new mongoose.Types.ObjectId(id_user), type: "COURSE" } },
      {
        $lookup: {
          from: "courses", // Collection Course
          localField: "id_material",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" }, // Chuyển mảng thành object
      { $replaceRoot: { newRoot: "$course" } },
      // Lookup để lấy số lượng progresses của khóa học
      {
        $lookup: {
          from: "progresses", // Bảng Progress
          let: { courseId: "$_id", userId: new mongoose.Types.ObjectId(id_user) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$id_course", "$$courseId"] }, // Lọc theo id_course
                    { $eq: ["$id_user", "$$userId"] } // Lọc theo id_user
                  ]
                }
              }
            }
          ],
          as: "progresses"
        }
      },

      // Lookup để lấy tổng số lessons của khóa học
      {
        $lookup: {
          from: "topics", // Bảng Topic
          localField: "_id",
          foreignField: "id_course",
          as: "topics",
        },
      },
      { $unwind: { path: "$topics", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "lessons", // Bảng Lesson
          localField: "topics._id",
          foreignField: "id_topic",
          as: "lessons",
        },
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          image: { $first: "$image" },
          totalProgress: { $first: { $size: "$progresses" } }, // Đếm số progress
          totalLessons: { $sum: { $size: "$lessons" } } // Đếm tổng số lessons
        }
      }

    ]);

    const orderExam = await Order.aggregate([
      { $match: { payment_status: "paid", id_user: new mongoose.Types.ObjectId(id_user), type: "EXAM" } },
      {
        $lookup: {
          from: "exams", // Collection Exam
          localField: "id_material",
          foreignField: "_id",
          as: "exam",
        },
      },
      { $unwind: "$exam" }, // Chuyển mảng thành object
      { $replaceRoot: { newRoot: "$exam" } },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          image: { $first: "$image" },
          link: { $first: "$link" },
          videos: { $first: "$examVideoIds" },
        }
      }
    ]);
    res.status(200).json({ orderCourse, orderExam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getYourCourseDetail = async (req, res) => {
  try {
    const { id_user, id_course } = req.query;

    const courseDetail = await Course.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id_course) } },

      // Lookup lấy danh sách topics
      {
        $lookup: {
          from: "topics",
          localField: "_id",
          foreignField: "id_course",
          as: "topics"
        }
      },
      { $unwind: { path: "$topics", preserveNullAndEmptyArrays: true } },
      { $sort: { "topics.createdAt": 1 } }, // Sắp xếp topics theo createdAt

      // Lookup lấy danh sách lessons trong mỗi topic
      {
        $lookup: {
          from: "lessons",
          localField: "topics._id",
          foreignField: "id_topic",
          as: "topics.lessons"
        }
      },
      { $unwind: { path: "$topics.lessons", preserveNullAndEmptyArrays: true } },
      { $sort: { "topics.lessons.createdAt": 1 } }, // Sắp xếp lessons theo createdAt

      // Lookup lấy danh sách exercises từ exerciseIds của mỗi lesson
      {
        $lookup: {
          from: "exercises",
          localField: "topics.lessons.exerciseIds",
          foreignField: "_id",
          as: "topics.lessons.exercises"
        }
      },

      // Lookup lấy progresses của user cho từng lesson
      {
        $lookup: {
          from: "progresses",
          let: { lessonId: "$topics.lessons._id", userId: new mongoose.Types.ObjectId(id_user) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$id_lesson", "$$lessonId"] },
                    { $eq: ["$id_user", "$$userId"] }
                  ]
                }
              }
            }
          ],
          as: "topics.lessons.progress"
        }
      },

      // Chỉ thêm isCompleted nếu lesson tồn tại
      {
        $addFields: {
          "topics.lessons": {
            $cond: {
              if: { $ifNull: ["$topics.lessons._id", false] },
              then: {
                _id: "$topics.lessons._id",
                id_topic: "$topics.lessons.id_topic",
                name: "$topics.lessons.name",
                video: "$topics.lessons.video",
                status: "$topics.lessons.status",
                createdAt: "$topics.lessons.createdAt",
                exercises: { $ifNull: ["$topics.lessons.exercises", []] },
                progress: "$topics.lessons.progress",
                isCompleted: { $gt: [{ $size: { $ifNull: ["$topics.lessons.progress", []] } }, 0] }
              },
              else: "$$REMOVE"
            }
          }
        }
      },

      // Gom nhóm lessons lại vào topics
      {
        $group: {
          _id: {
            courseId: "$_id",
            courseName: "$name",
            coursePrice: "$price",
            courseDiscount: "$discount",
            topicId: "$topics._id",
            topicName: "$topics.name",
            topicCreatedAt: "$topics.createdAt"
          },
          lessons: { $push: "$topics.lessons" }
        }
      },

      // Đảm bảo `lessons` luôn là mảng
      {
        $addFields: {
          lessons: {
            $filter: {
              input: "$lessons",
              as: "lesson",
              cond: { $ne: ["$$lesson", {}] }
            }
          }
        }
      },

      // Gom nhóm topics vào course
      {
        $group: {
          _id: "$_id.courseId",
          name: { $first: "$_id.courseName" },
          price: { $first: "$_id.coursePrice" },
          discount: { $first: "$_id.courseDiscount" },
          topics: {
            $push: {
              _id: "$_id.topicId",
              name: "$_id.topicName",
              createdAt: "$_id.topicCreatedAt",
              lessons: { $ifNull: ["$lessons", []] }
            }
          }
        }
      },

      // Sắp xếp topics theo createdAt
      {
        $addFields: {
          topics: { $sortArray: { input: "$topics", sortBy: { createdAt: 1 } } }
        }
      },

      // Xử lý tính toán tiến độ khóa học
      {
        $addFields: {
          topics: {
            $map: {
              input: "$topics",
              as: "topic",
              in: {
                _id: "$$topic._id",
                name: "$$topic.name",
                lessons: { $ifNull: ["$$topic.lessons", []] },
                totalLessons: { $size: { $ifNull: ["$$topic.lessons", []] } },
                completedLessons: {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$$topic.lessons", []] },
                      as: "lesson",
                      cond: { $eq: ["$$lesson.isCompleted", true] }
                    }
                  }
                }
              }
            }
          }
        }
      },

      // Tính tổng số lessons & lessons đã hoàn thành trên toàn bộ khóa học
      {
        $addFields: {
          totalLessons: { $sum: "$topics.totalLessons" },
          totalCompletedLessons: { $sum: "$topics.completedLessons" }
        }
      },

      // Tính phần trăm hoàn thành của khóa học
      {
        $addFields: {
          courseProgress: {
            $cond: {
              if: { $eq: ["$totalLessons", 0] },
              then: 0,
              else: { $multiply: [{ $divide: ["$totalCompletedLessons", "$totalLessons"] }, 100] }
            }
          }
        }
      }
    ]);

    res.status(200).json(courseDetail[0]);
  } catch (error) {
    console.error("Error fetching course detail:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getProgress = async (req, res) => {
  try {
    const {id_user, id_course} = req.query;
    // console.log(id_user, id_course);
    if(!id_course || !id_user) {
      return res.status(404).json({message: "Fields are require!"})
    }
    const Progresses = await Progress.find({id_user, id_course});
    res.status(200).json(Progresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProgress = async (req, res) => {
  try {
    const { id_user, id_course, id_lesson } = req.body;
    const newProgress = new Progress({ id_user, id_course, id_lesson, status: true });
    await newProgress.save();
    res.status(201).json({data: newProgress});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find Progress by ID and update
    const updatedProgress = await Progress.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedProgress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.status(200).json(updatedProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Progress by ID and delete
    const deletedProgress = await Progress.findByIdAndDelete(id);

    if (!deletedProgress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.status(200).json({ message: "Progress deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInfor = async (req, res) => {};

exports.updateInfor = async (req, res) => {};

exports.getRank = async (req, res) => {};

exports.getScore = async (req, res) => {};
