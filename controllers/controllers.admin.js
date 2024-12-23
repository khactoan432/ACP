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

const { validNameCodeforce, validUser } = require("../helpers/validations");
const bcrypt = require("bcrypt");

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

exports.createBanner = async (req, res) => {
  try {
    const { folderPath } = req.body;
    const files = req.files;

    if (!folderPath) {
      return res.status(400).json({ message: "Folder path is required!" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded!" });
    }

    // Upload multiple files to Google Cloud Storage
    const publicUrls = await uploadMultipleFilesToGCS(files, "Banners");

    if (!publicUrls || publicUrls.length === 0) {
      return res.status(500).json({ message: "Failed to upload files." });
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
    const updateData = req.body;
    const files = req.files[0];

    const publicUrl = await uploadFileToGCS(files, "Banners");

    if (!publicUrl) {
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

    updateData.image = publicUrl;

    // Find Banner by ID and update
    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

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

exports.createAchievement = async (req, res) => {
  try {
    const files = req.files;
    const { email_user, prize, competition } = req.body;

    if (!email_user || !prize || !competition) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded!" });
    }

    // Upload multiple files to Google Cloud Storage
    const publicUrl = await uploadFileToGCS(files[0], "Achievements");

    if (!publicUrl) {
      return res.status(500).json({ message: "Failed to upload files." });
    }

    // Save image URL to the database
    const achievement = await Achievement.create({
      email_user,
      prize,
      competition,
      image: publicUrl,
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
    const updateData = req.body;
    const files = req.files;

    // Find Banner by ID
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    if (files && files.length !== 0) {
      const publicUrl = await uploadFileToGCS(files[0], "Achievements");

      if (!publicUrl) {
        return res.status(500).json({ message: "Failed to upload file." });
      }

      // Lấy tên file từ URL của achievement
      const fileName = achievement.image
        .split("https://storage.googleapis.com/acp_website/")
        .pop(); // Assuming image URL is like "https://storage.googleapis.com/your-bucket-name/filename"

      // Xóa file tương ứng trong Google Cloud Storage
      await deleteFileFromGCS(fileName);

      updateData.image = publicUrl;
    }

    // Find achievement by ID and update
    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      updateData,
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

exports.createUser = async (req, res) => {
  try {
    const files = req.files;
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
    // try {
    //   const validationNameCodeforce = await validNameCodeforce(
    //     codeforce_name
    //   );
    //   if (!validationNameCodeforce) {
    //     return res
    //       .status(400)
    //       .json({ error: "Tên codeforce của bạn không tồn tại." });
    //   }
    // } catch (error) {
    //   return res.status(500).json({ error: "Lỗi khi kiểm tra Codeforce Name." });
    // }

    const validationUser = await validUser(email);
    if (validationUser) {
      return res.status(400).json({ error: "Email đã tồn tại." });
    }
    if (password !== repassword) {
      return res.status(400).json({ error: "Mật khẩu không trùng khớp." });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded!" });
    }

    // Upload multiple files to Google Cloud Storage
    const publicUrl = await uploadFileToGCS(files[0], "Users");

    if (!publicUrl) {
      return res.status(500).json({ message: "Failed to upload files." });
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
    const updateData = req.body || {};
    const files = req.files;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (files && files.length !== 0) {
      const publicUrl = await uploadFileToGCS(files[0], "Users");

      if (!publicUrl) {
        return res.status(500).json({ message: "Failed to upload file." });
      }

      // Lấy tên file từ URL của achievement
      const fileName = user.image
        .split("https://storage.googleapis.com/acp_website/")
        .pop(); // Assuming image URL is like "https://storage.googleapis.com/your-bucket-name/filename"

      // Xóa file tương ứng trong Google Cloud Storage
      await deleteFileFromGCS(fileName);

      updateData.image = publicUrl;
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
      // fileVideo = req.files["fileImage"];
      // if test image when internet low
      fileVideo = req.files["fileVideo"];

      video = await uploadMultipleFilesToGCS(fileVideo);
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
    console.log("id param: ", id);
    const updateData = req.body;
    console.log("updateData: ", updateData);

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
    // const file = req.files["fileImage"];
    // cmt for tes internet low
    const file = req.files["fileVideo"];

    if (!id_topic || !name || !status) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const uploadedFile = await uploadMultipleFilesToGCS(file);

    const newLesson = await Lesson.create({
      id_topic,
      name,
      video: uploadedFile[0],
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
    let file = "";
    let video = "";
    // if internet low : req.files["fileImage"] else req.files["fileVideo"]
    if (req.files["fileVideo"]) {
      file = req.files["fileVideo"];

      const arrVideo = await uploadMultipleFilesToGCS(file);
      video = arrVideo[0];
    } else {
      video = req.body.video;
    }

    console.log("video link :", video);
    let { name, exercises } = req.body;
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
        video: video,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    let allExercises = [];
    exercises = JSON.parse(exercises);

    if (exercises && Array.isArray(exercises)) {
      for (let exercise of exercises) {
        // Sử dụng for...of thay vì forEach
        if (exercise._id !== "") {
          const idExercise = exercise._id;
          const name = exercise.name;
          const link = exercise.link;
          const exerciseUpdated = await Exercise.findByIdAndUpdate(
            idExercise,
            {
              name,
              link,
            },
            {
              new: true,
              runValidators: true,
            }
          );
          allExercises.push(exerciseUpdated);
        } else {
          const name = exercise.name;
          const link = exercise.link;

          const newExercise = await Exercise.create({
            id_lesson: id,
            name,
            link,
          });
          allExercises.push(newExercise);

          await Lesson.findByIdAndUpdate(
            id,
            { $push: { exerciseIds: newExercise._id } },
            { new: true }
          );
        }
      }
    } else {
      console.error("exercises is not an array");
    }

    if (!updatedLesson) {
      return res.status(404).json({ error: "Lesson not found." });
    }
    if (!allExercises) {
      return res.status(404).json({ error: "Exercise not found." });
    }

    res.status(200).json({
      message: "Lesson updated successfully.",
      data: { lesson: updatedLesson, exercise: allExercises },
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
    const { id_lesson, dataExercise } = req.body;

    if (!id_lesson) {
      return res.status(400).json({ error: "All fields are required." });
    }
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

exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { updateData } = req.body; // link, name

    if (!id) {
      return res.status(400).json({ error: "ID fields are required." });
    }

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedExercise) {
      return res.status(404).json({ error: "Exam not found." });
    }

    res.status(200).json({
      message: "Exam updated successfully.",
      data: updatedExercise,
    });

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
