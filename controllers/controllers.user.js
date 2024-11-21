const { Comment, Rate, Course, Topic, Lesson, Exam, Order } = require("../models");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await exam.find();
    res.status(200).json(courses);
  } catch (err) {
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

exports.postOrderCourse = async (req, res) => {
  try {
    const { id_user, id_material, type } = req.body;
    const newOrder = new Order({ id_user, id_material, type});
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

exports.postOrderExam = async (req, res) => {
  try {
    const { id_user, id_material, type } = req.body;
    const newOrder = new Order({ id_user, id_material, type});
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.postComment = async (req, res) => {
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

exports.postRate = async (req, res) => {
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

    // Find Rate by ID and update
    const updatedRate = await Rate.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedRate) {
      return res.status(404).json({ message: "Rate not found" });
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

exports.getInfor = async (req, res) => {

};

exports.updateInfor = async (req, res) => {

};

exports.getRank = async (req, res) => {

};

exports.getScore = async (req, res) => {

};