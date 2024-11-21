const { Comment, Rate, Course, Topic, Lesson, Exam, Order } = require("../models");

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.postBanner = async (req, res) => {
  try {
    const { image } = req.body;
    const newBanner = new Banner({ image });
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.postAchievement = async (req, res) => {
  try {
    const { id_user, prize, competition } = req.body;
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

    // Find Achievement by ID and update
    const updatedAchievement = await Achievement.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedAchievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.status(200).json(updatedAchievement);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.postUser = async (req, res) => {
  try {
    const { name, image, email, password, phone_number, codeforce_name } = req.body;
    const newUser = new User({ name, image, email, password, phone_number, codeforce_name });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    // Find User by ID and update
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.postCourse = async (req, res) => {
  try {
    const { id_user, name, image, email, password, phone_number, codeforce_name } = req.body;
    const newCourse = new Course({ name, image, email, password, phone_number, codeforce_name });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    // Find Course by ID and update
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params; 

    // Find Course by ID and delete
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.get("/courses", adminController.getCourse);
router.post("/course", adminController.createCourse);
router.put("/course/:id", adminController.createCourse);
router.delete("/course/:id", adminController.deleteCourse);

router.get("/topics", adminController.getTopic);
router.post("/topic", adminController.createTopic);
router.put("/topic/:id", adminController.createTopic);
router.delete("/topic/:id", adminController.deleteTopic);

router.get("/lessons", adminController.getLesson);
router.post("/lesson", adminController.createLesson);
router.put("/lesson/:id", adminController.createLesson);
router.delete("/lesson/:id", adminController.deleteLesson);

router.get("/videos", adminController.getVideo);
router.post("/video", adminController.createVideo);
router.put("/video/:id", adminController.createVideo);
router.delete("/video/:id", adminController.deleteVideo);

router.get("/students", adminController.getStudent);
router.post("/student", adminController.createStudent);
router.put("/student/:id", adminController.createStudent);
router.delete("/student/:id", adminController.deleteStudent);

router.get("/exams", adminController.getExam);
router.post("/exam", adminController.createExam);
router.put("/exam/:id", adminController.createExam);
router.delete("/exam/:id", adminController.deleteExam);

router.get("/overviews", adminController.getOverview);
router.post("/overview", adminController.createOverview);
router.put("/overview/:id", adminController.createOverview);
router.delete("/overview/:id", adminController.deleteOverview);

router.get("/describes", adminController.getDescribe);
router.post("/describe", adminController.createDescribe);
router.put("/describe/:id", adminController.createDescribe);
router.delete("/describe/:id", adminController.deleteDescribe);

router.get("/orders", adminController.getOrder);
router.post("/order", adminController.createOrder);
router.put("/order/:id", adminController.createOrder);
router.delete("/order/:id", adminController.deleteOrder);

router.post("/comments", adminController.createComment);
router.put("/comment/:id", adminController.createComment);
router.delete("/comment/:id", adminController.deleteComment);

router.post("/rates", adminController.createRate);
router.put("/rate/:id", adminController.createRate);
router.delete("/rate/:id", adminController.deleteRate);