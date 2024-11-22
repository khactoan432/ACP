const {
  Comment,
  Rate,
  Banner,
  Achievement,
  Course,
  Topic,
  Lesson,
  Exam,
} = require("../models");

class indexController {
  // Lấy danh sách comments
  async getComments(req, res) {
    try {
      const { id } = req.params;
      //id is courseId, id_commented is include idCourse, idExam, idUser other of user'
      let { limit } = req.query;
      limit = parseInt(limit);
      const isValidLimit = limit && limit < 1;
      let query = Comment.find({ id_commented: id });

      if (isValidLimit) {
        query = query.limit(limit);
      }

      const comments = await query.exec();

      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy danh sách rates
  async getRates(req, res) {
    try {
      const { id } = req.params;
      //id is courseId, id_commented is include idCourse, idExam, idUser other of user'
      const { limit } = req.query;
      limit = parseInt(limit);
      const { type } = req.query;

      if (!type || !["COURSE", "EXAM"].includes(type)) {
        return res
          .status(400)
          .json({ error: "Type must be 'COURSE' or 'EXAM'." });
      }

      const isValidLimit = limit && limit < 1;
      let query = Rate.find({ id_rated: id, type });

      if (isValidLimit) {
        query = query.limit(limit);
      }

      const rates = await query.exec();
      res.status(200).json(rates);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy danh sách banners
  async getBanners(req, res) {
    try {
      const { limit } = req.query;
      limit = parseInt(limit);
      const isValidLimit = limit && limit > 0;
      const banners = await Banner.find().limit(isValidLimit ? limit : 0);

      res.status(200).json(banners);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy danh sách achievements
  async getAchievements(req, res) {
    try {
      const { limit } = req.query;
      limit = parseInt(limit);
      const isValidLimit = limit && limit > 0;
      let achievements = await Achievement.find().limit(
        isValidLimit ? limit : 0
      );
      res.status(200).json(achievements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy danh sách courses
  async getCourses(req, res) {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      limit = parseInt(limit);

      if (id) {
        const course = await Course.findById(id);
        if (!course) {
          return res.status(404).json({ error: "Khóa học không tồn tại." });
        }
        return res.status(200).json(course);
      }
      const isValidLimit = limit && limit > 0;
      let query = Course.find();
      if (isValidLimit) {
        query = query.limit(limit);
      }
      const courses = await query.exec();
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy danh sách topics
  async getTopics(req, res) {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      limit = parseInt(limit);
      const isValidLimit = limit && limit > 0;
      const topics = await Topic.find({ id_course: id }).limit(
        isValidLimit ? limit : 0
      );
      res.status(200).json(topics);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy danh sách lessons
  async getLessons(req, res) {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      limit = parseInt(limit);
      const isValidLimit = limit && limit > 0;
      const lessons = await Lesson.find({ id_topic: id }).limit(
        isValidLimit ? limit : 0
      );
      res.status(200).json(lessons);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy danh sách exams
  async getExams(req, res) {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      limit = parseInt(limit);

      if (id) {
        const exams = await Exam.findById(id);
        if (!exams) {
          return res.status(404).json({ error: "Đề thi không tồn tại." });
        }
        return res.status(200).json(exams);
      }
      const isValidLimit = limit && limit > 0;
      let query = Exam.find();
      if (isValidLimit) {
        query = query.limit(limit);
      }
      const exams = await query.exec();
      res.status(200).json(exams);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new indexController();
