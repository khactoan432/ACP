const { Storage } = require('@google-cloud/storage');
const path = require('path');
require("dotenv").config();

// Kết nối với Google Cloud Storage bằng Service Account Key
const storage = new Storage({
  keyFilename: path.join(__dirname, '../google-cloud-key.json'), // Đường dẫn tới Service Account Key
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, // Thay bằng Project ID của bạn
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Thay bằng tên bucket của bạn
const bucket = storage.bucket(bucketName);

// Controller: Tải file lên bucket
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const blob = bucket.file(req.file.originalname); // Tên tệp trong bucket
    const blobStream = blob.createWriteStream();

    // Lưu file vào bucket
    blobStream.on('error', (err) => {
      return res.status(500).json({ message: 'Upload error', error: err.message });
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      res.status(200).json({
        message: 'File uploaded successfully!',
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Controller: Lấy danh sách tệp trong bucket
exports.listFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();

    const fileList = files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
    }));

    res.status(200).json({
      message: 'File list retrieved successfully!',
      files: fileList,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Controller: Xóa file khỏi bucket
exports.deleteFile = async (req, res) => {
  const { filename } = req.params;

  try {
    await bucket.file(filename).delete();
    res.status(200).json({ message: `File ${filename} deleted successfully!` });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
