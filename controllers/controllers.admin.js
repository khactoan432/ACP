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
  ExamVideo,
  Overview,
  Order,
  Describe,
  Register,
  Exercise,
  Advisory,
} = require("../models");

const {
  uploadFileToGCS,
  uploadMultipleFilesToGCS,
  listFilesFromGCS,
  deleteFileFromGCS,
} = require("../helpers/googleCloudStorage");

const { validNameCodeforce, validUser } = require("../helpers/validations");
const bcrypt = require("bcryptjs");
const CategoryType = require("../models/categoryType");
const Category = require("../models/category");

exports.getBanners = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1; // Default: 0 (start from the beginning)
    const limit = parseInt(req?.query?.limit) || 100; // Default: 10 (fetch 10 records)

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

exports.createBanner = async (req, res) => {
  try {
    const fileImage = req.files["fileImage"];

    if (!fileImage || fileImage.length === 0) {
      return res.status(400).json({ message: "No fileImage uploaded!" });
    }

    // Upload multiple fileImage to Google Cloud Storage
    const publicUrls = await uploadMultipleFilesToGCS(fileImage, "Banners");

    if (!publicUrls || publicUrls.length === 0) {
      return res.status(500).json({ message: "Failed to upload fileImage." });
    }

    // Save each image URL to the database
    const bannerPromises = publicUrls.map((url) =>
      Banner.create({ image: url })
    );
    const banners = await Promise.all(bannerPromises);

    // Send a successful response with the created banners
    res.status(201).json({
      message: "Create banners successfully.",
      data: banners,
    });
  } catch (err) {
    console.error("Error creating banner:", err);
    res.status(500).json({
      message: "An error occurred while creating the banner.",
      error: err.message,
    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;

    let image = "";

    if (req.files["fileImage"]) {
      let linkImage = await uploadMultipleFilesToGCS(
        req.files["fileImage"],
        "Banners"
      );
      image = linkImage[0];
    } else {
      image = req.body.image;
    }
    if (!image) {
      return res.status(500).json({ message: "Failed to upload file." });
    }

    // Find Banner by ID
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Lấy tên file từ URL của banner
    const fileName = banner.image
      .split("https://storage.googleapis.com/acp_website/")
      .pop(); // Assuming image URL is like "https://storage.googleapis.com/your-bucket-name/filename"

    // Xóa file tương ứng trong Google Cloud Storage
    await deleteFileFromGCS(fileName);

    // Find Banner by ID and update
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { image },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({
      message: "Update banner successfully.",
      data: updatedBanner,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Banner by ID
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Lấy tên file từ URL của banner
    const fileName = banner.image
      .split("https://storage.googleapis.com/acp_website/")
      .pop(); // Assuming image URL is like "https://storage.googleapis.com/your-bucket-name/filename"

    // Xóa file tương ứng trong Google Cloud Storage
    await deleteFileFromGCS(fileName);

    // Xóa Banner trong cơ sở dữ liệu
    const deletedBanner = await Banner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({
      message: "Delete banner successfully",
      data: deletedBanner,
    });
  } catch (err) {
    console.error("Error deleting banner:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 100; // Default: 10 (fetch 10 records)

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

exports.createAchievement = async (req, res) => {
  try {
    const fileImage = req.files["fileImage"];
    if (!fileImage || fileImage.length === 0) {
      return res.status(400).json({ message: "No fileImage uploaded!" });
    }
    // Upload multiple fileImage to Google Cloud Storage
    const publicUrl = await uploadMultipleFilesToGCS(fileImage, "Achievements");

    if (!publicUrl) {
      return res.status(500).json({ message: "Failed to upload fileImage." });
    }

    const { email_user, prize, competition } = req.body;

    if (!email_user || !prize || !competition) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Save image URL to the database
    const achievement = await Achievement.create({
      email_user,
      prize,
      competition,
      image: publicUrl[0],
    });

    // Send a successful response with the created banners
    res.status(201).json({
      message: "Create achievements successfully.",
      data: achievement,
    });
  } catch (err) {
    console.error("Error creating achievements:", err);
    res.status(500).json({
      message: "An error occurred while creating the achievements.",
      error: err.message,
    });
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { email_user, prize, competition } = req.body;
    let image = "";
    if (req.files["fileImage"]) {
      let linkImage = await uploadMultipleFilesToGCS(
        req.files["fileImage"],
        "Achievements"
      );
      image = linkImage[0];
    } else {
      image = req.body.image;
    }

    if (!image) {
      return res.status(500).json({ message: "Failed to upload file." });
    }

    // Find Banner by ID
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    // Find achievement by ID and update
    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      { email_user, prize, competition, image },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedAchievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.status(200).json({
      message: "Created achievements successfully.",
      data: updatedAchievement,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    // Find achievement by ID
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    // Lấy tên file từ URL của achievement
    const fileName = achievement.image
      .split("https://storage.googleapis.com/acp_website/")
      .pop(); // Assuming image URL is like "https://storage.googleapis.com/your-bucket-name/filename"

    // Xóa file tương ứng trong Google Cloud Storage
    await deleteFileFromGCS(fileName);

    // Xóa achievement trong cơ sở dữ liệu
    const deletedAchievement = await Achievement.findByIdAndDelete(id);

    if (!deletedAchievement) {
      return res.status(404).json({ message: "Have error in delete!" });
    }

    res.status(200).json({
      message: "Delete achievements successfully.",
      data: deletedAchievement,
    });
  } catch (err) {
    console.error("Error deleting Achievement:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const role = req.query.role || "";
    const page = parseInt(req.query.page) || 1; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 100; // Default: 10 (fetch 10 records)

    // Tính số lượng người dùng có role
    const totalTeachers = await User.countDocuments({ role: role });

    // Lấy danh sách người dùng với role
    const users = await User.find({ role: role })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
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

exports.createUser = async (req, res) => {
  try {
    const fileImage = req.files["fileImage"];
    const {
      name,
      email,
      password,
      repassword,
      phone_number,
      codeforce_name,
      role,
    } = req.body;

    // Validation
    try {
      const validationNameCodeforce = await validNameCodeforce(codeforce_name);
      if (!validationNameCodeforce) {
        return res
          .status(400)
          .json({ error: "Tên codeforce của bạn không tồn tại." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Lỗi khi kiểm tra Codeforce Name." });
    }

    const validationUser = await validUser(email);
    if (validationUser) {
      return res.status(400).json({ error: "Email đã tồn tại." });
    }
    if (password !== repassword) {
      return res.status(400).json({ error: "Mật khẩu không trùng khớp." });
    }

    // Upload multiple fileImage to Google Cloud Storage
    let publicUrl = "";
    if (fileImage) {
      publicUrl = await uploadFileToGCS(fileImage[0], "Users");

      if (!publicUrl) {
        return res.status(500).json({ message: "Failed to upload fileImage." });
      }
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
      image: publicUrl,
    });
    await newUser.save();

    res.status(201).json({
      message: "Create users successfully.",
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, codeforce_name, phone_number } = req.body;
    if (!name || !email || !codeforce_name || !phone_number) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    let image = "";

    if (req.files["fileImage"]) {
      let linkImage = await uploadMultipleFilesToGCS(
        req.files["fileImage"],
        "Banners"
      );
      image = linkImage[0];
    } else {
      image = req.body.image;
    }
    if (!image) {
      return res.status(500).json({ message: "Failed to upload file." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (image && image.length !== 0) {
      // Lấy tên file từ URL của achievement
      const fileName = user.image
        .split("https://storage.googleapis.com/acp_website/")
        .pop(); // Assuming image URL is like "https://storage.googleapis.com/your-bucket-name/filename"

      // Xóa file tương ứng trong Google Cloud Storage
      await deleteFileFromGCS(fileName);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        codeforce_name,
        phone_number,
        image,
      },
      {
        new: true, // Trả về tài liệu sau khi cập nhật
        runValidators: true, // Chạy các validator của schema
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ err: "Invalid user ID." });
    }

    res.status(500).json({ err: "An error occurred while updating the user." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find User by ID and delete
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fileName = user.image
      .split("https://storage.googleapis.com/acp_website/")
      .pop(); // Assuming image URL is like "https://storage.googleapis.com/your-bucket-name/filename"

    // Xóa file tương ứng trong Google Cloud Storage
    await deleteFileFromGCS(fileName);

    // Xóa user trong cơ sở dữ liệu
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
        data: deletedUser,
      });
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

    let image = "";
    if (req.files && req.files["fileImage"]) {
      const fileImage = req.files["fileImage"];
      image = await uploadMultipleFilesToGCS(fileImage);
    } else {
      image = req.body.image;
    }

    let video = "";
    if (req.files && req.files["fileVideo"]) {
      const fileVideo = req.files["fileVideo"];
      video = await uploadMultipleFilesToGCS(fileVideo);
    } else {
      video = req.body.video;
    }

    const { name, price, discount } = req.body;

    // Tạo một object chỉ chứa các trường có giá trị
    const updateFields = {};
    if (name) updateFields.name = name;
    if (price) updateFields.price = price;
    if (discount) updateFields.discount = discount;
    if (image) updateFields.image = Array.isArray(image) ? image[0] : image;
    if (video) updateFields.video = Array.isArray(video) ? video[0] : video;

    // Kiểm tra xem có trường nào để cập nhật không
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateFields, {
      new: true, // Trả về document sau khi cập nhật
      runValidators: true, // Kiểm tra validation
    });

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    res.status(200).json({
      message: "Course updated successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
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
    const { id } = req.params;
    const allTopic = await Topic.find({ id_course: id }).lean();

    if (allTopic.length > 0) {
      res.status(200).json({
        message: "Get all video successfully",
        data: allTopic,
      });
    } else {
      res.status(200).json({
        message: "No topic found",
        data: [],
      });
    }
  } catch (err) {
    console.error("Error fetching paginated topics:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
      return res
        .status(400)
        .json({ error: "Course ID and name are required." });
    }

    const newTopic = await Topic.create({ id_course: id, name, lessonIds: [] });
    await Course.findByIdAndUpdate(
      id,
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
    const { id } = req.params; // id: id_topic

    const lessonIds = await Lesson.find({ id_topic: { $in: id } });
    const lessonIdsArray = lessonIds.map((lesson) => lesson._id);

    await Exercise.deleteMany({ id_lesson: { $in: lessonIdsArray } });
    await Lesson.deleteMany({ id_topic: { $in: id } });

    const deleteTopic = await Topic.findByIdAndDelete(id);

    if (!deleteTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Xóa khóa Topic trong Course
    await Course.updateMany({ topicIds: id }, { $pull: { topicIds: id } });

    res.status(200).json({
      message:
        "Topic, lesson of topic and exercise of lesson deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const { id } = req.params;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const allLeson = await Lesson.find({ id_topic: id })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    if (allLeson.length > 0) {
      const exercisePromise = allLeson.map(async (lesson) => {
        const exercises = await Exercise.find({
          _id: { $in: lesson.exerciseIds },
        });
        return {
          ...lesson.toObject(),
          exercises,
        };
      });

      const allLessonWithExercises = await Promise.all(exercisePromise);
      res.status(200).json({
        message: "Describes fetched successfully",
        data: allLessonWithExercises,
      });
    } else {
      res.status(200).json({
        message: "No topic found",
        data: [],
      });
    }
  } catch (err) {
    console.error("Error fetching paginated topics:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id: ", id);
    const { name, status } = req.body;
    console.log("name: ", name);
    console.log("status: ", status);
    const file = req.files["fileVideo"];
    console.log("file", file);

    if (!id || !name || !status) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const uploadedFile = await uploadMultipleFilesToGCS(file);
    console.log("uploaded file", uploadedFile);
    const newLesson = await Lesson.create({
      id_topic: id,
      name,
      video: uploadedFile[0],
      status,
    });
    await Topic.findByIdAndUpdate(
      id,
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
    let video = "";
    if (req.files["fileVideo"]) {
      let file = req.files["fileVideo"];
      const link = await uploadMultipleFilesToGCS(file);
      video = link[0];
    } else {
      video = req.body.video;
    }

    let { name } = req.body;
    if (!name | !video) {
      return res
        .status(400)
        .json({ error: "No data provided for update.Missing data" });
    }
    // update lesson
    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      {
        name,
        video,
      },
      {
        new: true,
        runValidators: true,
      }
    );

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
    // Xóa khóa lesson trong Topic
    await Topic.updateMany({ lessonIds: id }, { $pull: { lessonIds: id } });

    res
      .status(200)
      .json({ message: "Lesson, exercises of lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { dataExercise } = req.body;

    if (!id) {
      return res.status(400).json({ error: "All fields are required." });
    }
    let dataLink = [];
    if (dataExercise.length > 0) {
      for (let i = 0; i < dataExercise.length; i++) {
        const name = dataExercise[i].name;
        const link = dataExercise[i].link;
        const newExercise = await Exercise.create({
          id_lesson: id,
          name,
          link,
        });

        await Lesson.findByIdAndUpdate(
          id,
          { $push: { exerciseIds: newExercise._id } },
          { new: true }
        );

        dataLink.push(newExercise);
      }
    }
    res.status(201).json({
      message: "exercise created successfully.",
      data: dataLink,
    });
  } catch (error) {
    console.error("Error creating exercise:", error);

    res
      .status(500)
      .json({ error: "An error occurred while creating the exercise." });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID fields are required." });
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      id,
      { name, link },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExercise) {
      return res.status(404).json({ error: "Exam not found." });
    }

    res.status(200).json({
      message: "Exam updated successfully.",
      data: updatedExercise,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);

    res
      .status(500)
      .json({ error: "An error occurred while creating the lesson." });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Lesson by ID and delete
    const deletedExercise = await Exercise.findByIdAndDelete(id);

    if (!deletedExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Xóa khóa Exercise trong Lesson
    await Lesson.updateMany(
      { exerciseIds: id },
      { $pull: { exerciseIds: id } }
    );

    res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const { name, link, price, discount, categories } = req.body;
    const id_user = req.user._id;

    const fileImage = req.files["fileImage"];
    const fileVideo = req.files["fileVideo"];
    if (!name || !link || !price || !discount || !fileImage || !fileVideo) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // const newExam = await Exam.create({ id_user, name, link, video });
    const categoriesParser = JSON.parse(categories);
    console.log("categoriesParser: ", categoriesParser);

    const uploadedFileImageUrls = await uploadMultipleFilesToGCS(fileImage);
    const uploadedFilesVideoUrls = await uploadMultipleFilesToGCS(fileVideo);
    // xử lý chỉ có 1 video || 1 ảnh
    const newExam = await Exam.create({
      id_user,
      name,
      link,
      price,
      discount,
      categories: categoriesParser,
      image: uploadedFileImageUrls[0],
      video: uploadedFilesVideoUrls[0],
    });

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
    let fileImage = "";
    let image = "";
    if (req.files["fileImage"]) {
      fileImage = req.files["fileImage"];
      let linkImage = await uploadMultipleFilesToGCS(fileImage);
      image = linkImage[0];
    } else {
      image = req.body.image;
    }

    let fileVideo = "";
    let video = "";
    if (req.files["fileVideo"]) {
      fileVideo = req.files["fileVideo"];
      let linkVideo = await uploadMultipleFilesToGCS(fileVideo);
      video = linkVideo[0];
    } else {
      video = req.body.video;
    }

    const { name, link, price, discount, categories } = req.body;

    if (!name || !link || !price || !discount || !image || !video) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const categoriesParser = JSON.parse(categories);
    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      {
        name,
        link,
        price,
        discount,
        categories: categoriesParser,
        image: image,
        video: video,
      },
      {
        new: true,
        runValidators: true,
      }
    );
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

exports.getExamVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const allVideo = await ExamVideo.find({ id_exam: id }).lean();

    if (allVideo.length > 0) {
      res.status(200).json({
        message: "Get all video successfully",
        data: allVideo,
      });
    } else {
      res.status(200).json({
        message: "No video found",
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createExamVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { describe } = req.body;
    let video = "";
    const videoFile = req.files["fileVideo"];
    if (videoFile) {
      video = await uploadMultipleFilesToGCS(videoFile);
    }
    if (!video) {
      return res.status(400).json({ error: "Video is required" });
    }
    const newExamVideo = await ExamVideo.create({
      id_exam: id,
      describe,
      video: video[0],
    });

    await Exam.findByIdAndUpdate(
      id,
      { $push: { examVideoIds: newExamVideo._id } },
      { new: true }
    );

    res.status(200).json({
      message: "Create video successfully",
      data: newExamVideo,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExamVideo = async (req, res) => {
  try {
    const { id } = req.params;

    let { describe } = req.body;
    let video = "";

    if (req.files["fileVideo"]) {
      let linkVideo = await uploadMultipleFilesToGCS(req.files["fileVideo"]);
      video = linkVideo[0];
    } else {
      video = req.body.video;
    }
    const updateVideoExam = await ExamVideo.findByIdAndUpdate(
      id,
      { describe, video },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Update video successfully",
      data: updateVideoExam,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExamVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteVideoExam = await ExamVideo.findByIdAndDelete(id);
    if (!deleteVideoExam) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
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
    // Xóa khóa overviews trong describe
    await Describe.updateMany(
      { overviewIds: id },
      { $pull: { overviewIds: id } }
    );

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

    // Duyệt qua từng "describe" để lấy danh sách các "Overview" theo "overviewIds"
    const overviewPromises = describes.map(async (describe) => {
      const overviews = await Overview.find({
        _id: { $in: describe.overviewIds }, // Truy vấn Overview với mảng _id nằm trong overviewIds
      });

      return {
        ...describe.toObject(),
        overviews, // Thêm thông tin overviews vào mỗi describe
      };
    });

    // Đợi tất cả các truy vấn Overview hoàn thành
    const describesWithOverviews = await Promise.all(overviewPromises);

    res.status(200).json({
      message: "Describes fetched successfully",
      data: describesWithOverviews,
    });
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
    console.log("id: ", id);

    // Find Describe by ID and delete
    const deletedDescribe = await Describe.findByIdAndDelete(id);

    if (!deletedDescribe) {
      return res.status(404).json({ message: "Describe not found" });
    }

    // Xóa khóa describe trong Course
    await Course.updateMany(
      { describeIds: id },
      { $pull: { describeIds: id } }
    );

    res.status(200).json({ message: "Describe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default: 1 (page đầu tiên)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 records mỗi trang
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    const orders = await Order.aggregate([
      // Sắp xếp theo createdAt
      { $sort: { createdAt: 1 } },

      // Lấy dữ liệu theo page
      { $skip: skip },
      { $limit: limit },

      // Lookup với collection COURSE hoặc EXAM tùy theo type
      {
        $lookup: {
          from: "courses", // Collection cho COURSE
          localField: "id_material",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $lookup: {
          from: "exams", // Collection cho EXAM
          localField: "id_material",
          foreignField: "_id",
          as: "examDetails",
        },
      },

      // Gộp thông tin COURSE hoặc EXAM vào kết quả
      {
        $addFields: {
          materialName: {
            $cond: {
              if: { $eq: ["$type", "COURSE"] },
              then: { $arrayElemAt: ["$courseDetails.name", 0] },
              else: { $arrayElemAt: ["$examDetails.name", 0] },
            },
          },
        },
      },

      // Lookup thêm thông tin User
      {
        $lookup: {
          from: "users", // Collection cho User
          localField: "id_user",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      // Gộp thông tin User (chỉ lấy email)
      {
        $addFields: {
          userEmail: { $arrayElemAt: ["$userDetails.email", 0] },
        },
      },

      // Chỉ giữ lại các trường cần thiết
      {
        $project: {
          id_user: 1,
          id_material: 1,
          code: 1,
          type: 1,
          payment_status: 1,
          amount: 1,
          method: 1,
          createdAt: 1,
          materialName: 1, // Tên material (COURSE hoặc EXAM)
          userEmail: 1, // Email của user
        },
      },
    ]);

    res.status(200).json({
      message: "Get orders successfully.",
      total: totalOrders,
      data: orders,
    });
  } catch (err) {
    console.error(
      "Error fetching paginated orders with material name and user email:",
      err
    );
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
// category

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
      categories: categoryType.categoryIds, // Đổi tên trường từ categoryIds thành value
    }));

    return res.status(200).json({
      message: "CategoryTypes fetched successfully.",
      data: formattedCategoryTypes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategories = async (req, res) => {
  try {
    const { option, type, categories } = req.body;

    // Kiểm tra nếu thiếu option, type hoặc value
    if (!option || !type || !categories) {
      return res
        .status(400)
        .json({ message: "Missing required option | type | categories" });
    }

    // Nếu categories là một mảng, tạo từng Category cho mỗi giá trị trong categories
    const newCategoryType = await CategoryType.create({
      option,
      type,
      categoryIds: [],
    });

    const categoryIds = [];

    // Kiểm tra nếu value là mảng, nếu không thì gán thành mảng
    const values = Array.isArray(categories) ? categories : [categories];

    // Tạo các Category và lưu ID vào categoryIds
    for (let val of values) {
      const newCategory = await Category.create({
        category_type_id: newCategoryType._id,
        value: val.value,
      });
      categoryIds.push(newCategory._id);
    }

    // Cập nhật mảng categoryIds trong CategoryType
    newCategoryType.categoryIds = categoryIds;
    await newCategoryType.save();

    // Chuyển về đối tượng thuần túy
    const plainCategoryType = newCategoryType.toObject();
    const plainCategories = await Category.find({
      _id: { $in: categoryIds },
    }).lean();

    return res.status(200).json({
      message: "Categories created successfully.",
      data: {
        ...plainCategoryType,
        plainCategories,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { option, type, categories } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing required id categoryType" });
    }

    // Tìm CategoryType dựa trên id
    const categoryType = await CategoryType.findById(id);

    if (!categoryType) {
      return res.status(404).json({ message: "CategoryType not found" });
    }

    // Nếu có giá trị 'categories', xử lý cập nhật nhiều Category
    if (categories) {
      const values = Array.isArray(categories) ? categories : [categories];
      const categoryPromises = values.map(async (val) => {
        const id = val._id;
        if (id && val.value) {
          const category = await Category.findByIdAndUpdate(id);
          if (category) {
            category.value = val.value;
            await category.save();
          }
        } else if (!id && val.value) {
          const newCategory = await Category.create({
            category_type_id: categoryType._id,
            value: val.value,
          });
          return newCategory._id;
        } else if (id && !val.value) {
          const deleteCategory = await Category.findByIdAndDelete(id);
          await CategoryType.updateMany(
            { categoryIds: id },
            { $pull: { categoryIds: id } }
          );
        }
      });

      const updatedCategoryIds = (await Promise.all(categoryPromises)).filter(
        (id) => id // Lọc bỏ các phần tử `undefined`
      );
      categoryType.categoryIds = [
        ...categoryType.categoryIds,
        ...updatedCategoryIds,
      ];
      await categoryType.save();
    }

    // Nếu có thay đổi option hoặc type trong CategoryType, cập nhật
    if (option || type) {
      if (option) categoryType.option = option;
      if (type) categoryType.type = type;
      await categoryType.save();
    }

    return res.status(200).json({
      message: "CategoryType and Categories updated successfully.",
      data: categoryType.toObject(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (!id || !value) {
      return res
        .status(400)
        .json({ message: "Missing required id or update fields" });
    }

    // Tìm CategoryType dựa trên id
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "CategoryType not found" });
    }

    category.value = value;
    category.save();

    return res.status(200).json({
      message: "Category updated successfully.",
      data: category.toObject(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // ID của Category

    if (!id) {
      return res.status(400).json({ message: "Missing required category id" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndDelete(id);

    await CategoryType.updateMany(
      { categoryIds: id },
      { $pull: { categoryIds: id } }
    );

    return res.status(200).json({
      message: "Category deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategoryType = async (req, res) => {
  try {
    const { id } = req.params; // ID của CategoryType

    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing required category type id" });
    }

    // Tìm CategoryType và populate các Category liên quan
    const categoryType = await CategoryType.findById(id).populate(
      "categoryIds"
    );

    if (!categoryType) {
      return res.status(404).json({ message: "CategoryType not found" });
    }

    // Xóa tất cả các `Category` liên quan
    const categories = categoryType.categoryIds;
    if (categories && categories.length > 0) {
      await Promise.all(
        categories.map((category) => Category.findByIdAndDelete(category._id))
      );
    }

    // Xóa `CategoryType`
    await CategoryType.findByIdAndDelete(id);

    return res.status(200).json({
      message: "CategoryType and related categories deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// advisory

exports.getAdvisories = async (req, res) => {
  try {
    const advisories = await Advisory.find().sort({ date: -1 });

    if (!advisories || advisories.length === 0) {
      return res.status(200).json({ message: "No advisories found", data: [] });
    }

    return res.status(200).json({
      message: "Advisories fetched successfully.",
      data: advisories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAdvisories = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing required advisory id" });
    }

    const advisory = await Advisory.findByIdAndDelete(id);

    if (!advisory) {
      return res.status(404).json({ message: "Advisory not found" });
    }

    return res.status(200).json({
      message: "Advisory deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
