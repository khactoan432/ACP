const { User, Banner, Achievement, Comment, Rate, Course, Topic, Lesson, Exam, Order } = require("../models");

exports.getBanners = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Default: 0 (start from the beginning)
    const limit = parseInt(req.query.limit) || 10; // Default: 10 (fetch 10 records)
    const banners = 
      await Banner.find()
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
    res.status(500).json({ error: "An error occurred while creating the banner." });
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
    const achievements = 
      await Achievement.find()
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

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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

    res.status(500).json({ error: "An error occurred while updating the achievement." });
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
    const users = 
      await User.find()
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
    const {
      name,
      image,
      email,
      password,
      phone_number,
      codeforce_name,
      role,
    } = req.body;

    if (!name || !email || !password || !phone_number || !codeforce_name || !role) {
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

    res.status(500).json({ error: "An error occurred while creating the user." });
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

    res.status(500).json({ error: "An error occurred while updating the user." });
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

exports.createCourse = async (req, res) => {
  try {
    const { id_user, name, image, price, discount } = req.body;
    const newCourse = new Course({ id_user, name, image, price, discount });
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

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { id_course, name } = req.body;
    const newTopic = new Topic({ id_course, name });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    // Find Topic by ID and update
    const updatedTopic = await Topic.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json(updatedTopic);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const lessons = await Lesson.find();
    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { id_topic, name, video, status } = req.body;
    const newLesson = new Lesson({ id_topic, name, video, status });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    // Find Lesson by ID and update
    const updatedLesson = await Lesson.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(updatedLesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    const { id_user, name, link, video } = req.body;
    const newExam = new Exam({ id_user, name, link, video });
    await newExam.save();
    res.status(201).json(newExam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    // Find Exam by ID and update
    const updatedExam = await Exam.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json(updatedExam);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const overviews = await Overview.find();
    res.status(200).json(overviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOverview = async (req, res) => {
  try {
    const { id_material, type, name, decs } = req.body;
    const newOverview = new Overview({ id_material, type, name, decs });
    await newOverview.save();
    res.status(201).json(newOverview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOverview = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    // Find Overview by ID and update
    const updatedOverview = await Overview.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedOverview) {
      return res.status(404).json({ message: "Overview not found" });
    }

    res.status(200).json(updatedOverview);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const Describes = await Describe.find();
    res.status(200).json(Describes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDescribe = async (req, res) => {
  try {
    const { id_material, type, decs } = req.body;
    const newDescribe = new Describe({ id_material, type, decs });
    await newDescribe.save();
    res.status(201).json(newDescribe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateDescribe = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    // Find Describe by ID and update
    const updatedDescribe = await Describe.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedDescribe) {
      return res.status(404).json({ message: "Describe not found" });
    }

    res.status(200).json(updatedDescribe);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { id_user, id_material, type, payment_status } = req.body;
    const newOrder = new Order({ id_user, id_material, type, payment_status });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    // Find Order by ID and update
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

exports.getStudents = async (req, res) => {
  try {
    // Get the course ID from the request (assumed from query parameters or URL)
    const { courseId } = req.params;

    // Ensure courseId is provided
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    // Aggregation pipeline
    const users = await Register.aggregate([
      {
        // Match registrations for the given course
        $match: { id_material: parseInt(courseId), type: "COURSE" },
      },
      {
        // Lookup users to join user details
        $lookup: {
          from: "users", // Collection name (lowercase plural by convention)
          localField: "id_user", // Field in Register that matches User
          foreignField: "_id", // Field in User that matches
          as: "userDetails", // Output array field
        },
      },
      {
        // Unwind the joined user details (convert array to object)
        $unwind: "$userDetails",
      },
      {
        // Project only required fields (optional)
        $project: {
          _id: 0, // Exclude Register document ID
          id_user: 1,
          id_material: 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
          "userDetails.phone_number": 1,
        },
      },
    ]);

    // Respond with the users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users for the course:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { id_user, id_material, type } = req.body;
    const newStudent = new Register({ id_user, id_material, type });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    const updatedStudent = await Register.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Register not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params; 

    // Find Student by ID and delete
    const deletedStudent = await Register.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Register not found" });
    }

    res.status(200).json({ message: "Register deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const { id_user, id_rated, type, content } = req.body;
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