const {
  User,
  Banner,
  Achievement,
  Comment,
  Rate,
  Course,
  Topic,
  Lesson,
  Exam,
  Overview,
  Order,
  Describe,
  Register,
  Exercise,
} = require("../models");

const {
  uploadFileToGCS,
  uploadMultipleFilesToGCS,
  listFilesFromGCS,
  deleteFileFromGCS,
} = require("../helpers/googleCloudStorage");

const { uploadFile } = require("./controllers.upload");

exports.getBanners = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)

    const banners = await Banner.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(banners);
  } catch (err) {
    console.error("Error fetching paginated banners:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { image } = req.body;
    uploadFile(req, res);
    // Validate the required fields
    if (!image) {
      return res.status(400).json({ error: "Image field is required." });
    }

    // Create and save the new banner
    const newBanner = await Banner.create({ image });

    // Send a successful response
    res.status(201).json({
      message: "Banner created successfully.",
      data: newBanner,
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the banner." });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find Banner by ID and update
    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json(updatedBanner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Banner by ID and delete
    const deletedBanner = await Banner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const achievements = await Achievement.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(achievements);
  } catch (err) {
    console.error("Error fetching paginated achievements:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createAchievement = async (req, res) => {
  try {
    const { prize, competition } = req.body;
    const id_user = req.user._id;
    const newAchievement = new Achievement({ id_user, prize, competition });
    await newAchievement.save();
    res.status(201).json(newAchievement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAchievement) {
      return res.status(404).json({ error: "Achievement not found." });
    }

    res.status(200).json({
      message: "Achievement updated successfully.",
      data: updatedAchievement,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid achievement ID." });
    }

    res
      .status(500)
      .json({ error: "An error occurred while updating the achievement." });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Achievement by ID and delete
    const deletedAchievement = await Achievement.findByIdAndDelete(id);

    if (!deletedAchievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const users = await User.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching paginated users:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, image, email, password, phone_number, codeforce_name, role } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone_number ||
      !codeforce_name ||
      !role
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newUser = await User.create({
      name,
      image,
      email,
      password,
      phone_number,
      codeforce_name,
      role,
    });

    res.status(201).json({
      message: "User created successfully.",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000 && error.keyValue.email) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // Trả về tài liệu sau khi cập nhật
      runValidators: true, // Chạy các validator của schema
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find User by ID and delete
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit); // Default: 10 (fetch 10 records)
    const courses = await Course.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching paginated courses:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, price, discount } = req.body;
    const fileImage = req.files["fileImage"];
    const fileVideo = req.files["fileVideo"];
    const id_user = req.user._id;

    if (!name || !fileImage || !price || !discount) {
      return res.status(400).json({ error: "All fields are required." });
    }
    console.log("filevideo: ", fileVideo);
    const uploadedFileImageUrls = await uploadMultipleFilesToGCS(fileImage);
    let uploadedFilesVideoUrls = "";
    console.log("url_filevideo:", fileVideo);
    if (fileVideo) {
      uploadedFilesVideoUrls = await uploadMultipleFilesToGCS(fileVideo);
    }
    const newCourse = await Course.create({
      id_user,
      name,
      image: uploadedFileImageUrls[0],
      video: uploadedFilesVideoUrls ? uploadedFilesVideoUrls[0] : "",
      price,
      discount,
      describeIds: [],
      topicIds: [],
    });

    res.status(201).json({
      message: "Course created successfully.",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);

    if (error.code === 11000 && error.keyValue.id_user) {
      return res
        .status(400)
        .json({ error: "Course with this user already exists." });
    }

    res
      .status(500)
      .json({ error: "An error occurred while creating the course." });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let fileImage = "";
    let image = "";
    if (req.files["fileImage"]) {
      fileImage = req.files["fileImage"];
      image = await uploadMultipleFilesToGCS(fileImage);
    } else {
      image = req.body.image;
    }

    let fileVideo = "";
    let video = "";
    if (req.files["fileVideo"]) {
      fileVideo = req.files["fileImage"];
      image = await uploadMultipleFilesToGCS(fileImage);
    } else {
      video = req.body.video;
    }

    const { name, price, discount } = req.body;

    if (!name || !image || !price || !discount) {
      return res.status(400).json({ error: "All fields are required." });
    }

    console.log("check here");

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        name,
        price,
        discount,
        image: image,
        video: video,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    res.status(200).json({
      message: "Course updated successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid course ID." });
    }

    res
      .status(500)
      .json({ error: "An error occurred while updating the course." });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params; // Course ID to be deleted

    // Step 1: Delete all Describe documents related to the course
    await Describe.deleteMany({ id_material: id });

    // Step 2: Delete all Topic documents related to the course
    const topics = await Topic.find({ id_course: id });

    // Step 3: For each topic, delete all associated Lesson documents
    const topicIds = topics.map((topic) => topic._id);
    await Lesson.deleteMany({ id_topic: { $in: topicIds } });

    // Step 4: For each lesson, delete all associated Exercise documents
    const lessonIds = await Lesson.find({ id_topic: { $in: topicIds } });
    const lessonIdsArray = lessonIds.map((lesson) => lesson._id);
    await Exercise.deleteMany({ id_lesson: { $in: lessonIdsArray } });

    // Step 5: Delete all Topic documents related to the course
    await Topic.deleteMany({ id_course: id });

    // Step 6: Finally, delete the Course document
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    res.status(200).json({
      message: "Course and all related documents deleted successfully.",
      data: deletedCourse,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      error:
        "An error occurred while deleting the course and related documents.",
    });
  }
};

const { ObjectId } = require("mongoose").Types;

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
            exercises: allExercises.filter(
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
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const topics = await Topic.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(topics);
  } catch (err) {
    console.error("Error fetching paginated topics:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { id_course, name } = req.body;

    if (!id_course || !name) {
      return res
        .status(400)
        .json({ error: "Course ID and name are required." });
    }

    const newTopic = await Topic.create({ id_course, name, lessonIds: [] });
    await Course.findByIdAndUpdate(
      id_course,
      { $push: { topicIds: newTopic._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Topic created successfully.",
      data: newTopic,
    });
  } catch (error) {
    console.error("Error creating topic:", error);

    res
      .status(500)
      .json({ error: "An error occurred while creating the topic." });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTopic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    res.status(200).json({
      message: "Topic updated successfully.",
      data: updatedTopic,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid topic ID." });
    }

    res
      .status(500)
      .json({ error: "An error occurred while updating the topic." });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Topic by ID and delete
    const deletedTopic = await Topic.findByIdAndDelete(id);

    if (!deletedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const lessons = await Lesson.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(lessons);
  } catch (err) {
    console.error("Error fetching paginated lessons:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { id_topic, name, status } = req.body;
    const fileImage = req.files["fileImage"];
    // const fileVideo = req.files["fileVideo"];

    if (!id_topic || !name || !status) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const uploadedFileImageUrls = await uploadMultipleFilesToGCS(fileImage);
    let uploadedFilesVideoUrls = "";
    // if (fileVideo) {
    //   uploadedFilesVideoUrls = await uploadMultipleFilesToGCS(fileVideo);
    // }

    const newLesson = await Lesson.create({
      id_topic,
      name,
      video: uploadedFileImageUrls[0],
      status,
    });
    await Topic.findByIdAndUpdate(
      id_topic,
      { $push: { lessonIds: newLesson._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Lesson created successfully.",
      data: newLesson,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);

    res
      .status(500)
      .json({ error: "An error occurred while creating the lesson." });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLesson) {
      return res.status(404).json({ error: "Lesson not found." });
    }

    res.status(200).json({
      message: "Lesson updated successfully.",
      data: updatedLesson,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid lesson ID." });
    }

    console.error("Error updating lesson:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the lesson." });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Lesson by ID and delete
    const deletedLesson = await Lesson.findByIdAndDelete(id);

    if (!deletedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createExercise = async (req, res) => {
  try {
    const { id_lesson, dataExercise } = req.body;

    if (!id_lesson) {
      return res.status(400).json({ error: "All fields are required." });
    }
    console.log("dataExercise: ", dataExercise);
    let dataLink = [];
    if (dataExercise.length > 0) {
      for (let i = 0; i < dataExercise.length; i++) {
        const name = dataExercise[i].name;
        const link = dataExercise[i].link;
        const newExercise = await Exercise.create({ id_lesson, name, link });

        await Lesson.findByIdAndUpdate(
          id_lesson,
          { $push: { exerciseIds: newExercise._id } },
          { new: true }
        );

        dataLink.push(newExercise);
      }
    }
    res.status(201).json({
      message: "Lesson created successfully.",
      data: dataLink,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);

    res
      .status(500)
      .json({ error: "An error occurred while creating the lesson." });
  }
};

exports.getExams = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const exams = await Exam.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(exams);
  } catch (err) {
    console.error("Error fetching paginated exams:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    const { name, link, video } = req.body;
    const id_user = req.user._id;

    if (!name || !link || !video) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newExam = await Exam.create({ id_user, name, link, video });

    res.status(201).json({
      message: "Exam created successfully.",
      data: newExam,
    });
  } catch (error) {
    console.error("Error creating exam:", error);

    res
      .status(500)
      .json({ error: "An error occurred while creating the exam." });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    const updatedExam = await Exam.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedExam) {
      return res.status(404).json({ error: "Exam not found." });
    }

    res.status(200).json({
      message: "Exam updated successfully.",
      data: updatedExam,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid exam ID." });
    }

    console.error("Error updating exam:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the exam." });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Exam by ID and delete
    const deletedExam = await Exam.findByIdAndDelete(id);

    if (!deletedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOverviews = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const overviews = await Overview.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(overviews);
  } catch (err) {
    console.error("Error fetching paginated overviews:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createOverview = async (req, res) => {
  try {
    const { id_material, type, desc } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!id_material || !type || !desc) {
      return res.status(400).json({
        error: "All fields are required, and 'desc' must be a non-empty array.",
      });
    }

    const newOverview = await Overview.create({
      id_material,
      type,
      desc: desc,
    });

    // Push _id của Overview vào Describe
    await Describe.findByIdAndUpdate(
      id_material,
      { $push: { overviewIds: newOverview._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Overviews created successfully.",
      data: newOverview,
    });
  } catch (error) {
    console.error("Error creating overview:", error);

    res
      .status(500)
      .json({ error: "An error occurred while creating the overviews." });
  }
};

exports.updateOverview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: "Overview ID is required." });
    }

    const updatedOverview = await Overview.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOverview) {
      return res.status(404).json({ error: "Overview not found." });
    }

    res.status(200).json({
      message: "Overview updated successfully.",
      data: updatedOverview,
    });
  } catch (error) {
    console.error("Error updating overview:", error);

    res
      .status(500)
      .json({ error: "An error occurred while updating the overview." });
  }
};

exports.deleteOverview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Overview by ID and delete
    const deletedOverview = await Overview.findByIdAndDelete(id);

    if (!deletedOverview) {
      return res.status(404).json({ message: "Overview not found" });
    }

    res.status(200).json({ message: "Overview deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDescribes = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const describes = await Describe.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(describes);
  } catch (err) {
    console.error("Error fetching paginated describes:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createDescribe = async (req, res) => {
  try {
    const { id_material, type, desc } = req.body;

    if (![id_material, type, desc].every(Boolean)) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newDescribe = await Describe.create({
      id_material,
      type,
      desc,
      overviewIds: [],
    });

    await Course.findByIdAndUpdate(
      id_material,
      { $push: { describeIds: newDescribe._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Describe created successfully.",
      data: newDescribe,
    });
  } catch (error) {
    console.error("Error creating describe:", error);

    res.status(500).json({
      error: "An unexpected error occurred while creating the describe.",
    });
  }
};

exports.updateDescribe = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "ID and update data are required." });
    }

    const updatedDescribe = await Describe.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDescribe) {
      return res.status(404).json({ message: "Describe not found." });
    }

    res.status(200).json({
      message: "Describe updated successfully.",
      data: updatedDescribe,
    });
  } catch (error) {
    console.error("Error updating describe:", error);

    res.status(500).json({
      error: "An unexpected error occurred while updating the describe.",
    });
  }
};

exports.deleteDescribe = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Describe by ID and delete
    const deletedDescribe = await Describe.findByIdAndDelete(id);

    if (!deletedDescribe) {
      return res.status(404).json({ message: "Describe not found" });
    }

    res.status(200).json({ message: "Describe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const orders = await Order.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching paginated orders:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No data provided to update." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Enforce schema validation rules
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({
      message: "Order updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      error: "An error occurred while updating the order.",
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Order by ID and delete
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRegisters = async (req, res) => {
  try {
    const { id_material, type, page = 1, limit = 5 } = req.query;

    if (!id_material || !type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const registers = await Register.aggregate([
      {
        $match: { id_material, type },
      },
      {
        $addFields: {
          id_user: { $toObjectId: "$id_user" }, // Convert id_user to ObjectId
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "id_user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true, // Include entries without matching users
        },
      },
      {
        $project: {
          id_user: 1,
          id_material: 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
          "userDetails.phone_number": 1,
          "userDetails.codeforce_name": 1,
          "userDetails.createdAt": 1,
        },
      },
      {
        $sort: { "userDetails.createdAt": 1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parsedLimit,
      },
    ]);

    res.status(200).json(registers);
  } catch (error) {
    console.error("Error fetching registers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching registers." });
  }
};

exports.createRegister = async (req, res) => {
  try {
    const { id_material, type } = req.body;
    const id_user = req.user._id;

    if (![id_user, id_material, type].every(Boolean)) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const validTypes = ["COURSE", "EXAM"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid type. Allowed values are: ${validTypes.join(", ")}.`,
      });
    }

    const newRegister = await Register.create({ id_user, id_material, type });

    res.status(201).json({
      message: "Register registration created successfully.",
      data: newRegister,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while creating the student registration.",
    });
  }
};

exports.updateRegister = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No data provided to update." });
    }

    const updatedRegister = await Register.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRegister) {
      return res.status(404).json({ error: "Register not found." });
    }

    res.status(200).json({
      message: "Student registration updated successfully.",
      data: updatedRegister,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating the student registration.",
    });
  }
};

exports.deleteRegister = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Register by ID and delete
    const deletedRegister = await Register.findByIdAndDelete(id);

    if (!deletedRegister) {
      return res.status(404).json({ message: "Register not found" });
    }

    res.status(200).json({ message: "Register deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { id_commented, type, content } = req.body;
    const id_user = req.user._id;
    if (!id_commented || !type || !content) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newComment = await Comment.create({
      id_user,
      id_commented,
      type,
      content,
    });

    res.status(201).json({
      message: "Comment created successfully.",
      data: newComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment." });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedComment) {
      return res.status(404).json({ message: "Register not found" });
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

exports.createRate = async (req, res) => {
  try {
    const { id_rated, type, content } = req.body;
    const id_user = req.user._id;
    const newRate = new Rate({ id_user, id_rated, type, content });
    await newRate.save();
    res.status(201).json(newRate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRate = await Rate.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedRate) {
      return res.status(404).json({ message: "Register not found" });
    }

    res.status(200).json(updatedRate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRate = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Rate by ID and delete
    const deletedRate = await Rate.findByIdAndDelete(id);

    if (!deletedRate) {
      return res.status(404).json({ message: "Rate not found" });
    }

    res.status(200).json({ message: "Rate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
