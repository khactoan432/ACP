const express = require("express");
const multer = require("multer");
const {
  uploadFiles,
  listFiles,
  deleteFile,
} = require("../controllers/controllers.upload");

// Khởi tạo router
const router = express.Router();

// Cấu hình multer để xử lý file upload
const upload = multer({
  storage: multer.memoryStorage(), // Lưu file vào bộ nhớ trước khi tải lên Google Cloud Storage
});

// Định nghĩa các route
router.post("/upload", upload.array("files"), uploadFiles); // Upload file
router.get("/files", listFiles); // Lấy danh sách file
router.delete("/files/:filename", deleteFile); // Xóa file

module.exports = router;
