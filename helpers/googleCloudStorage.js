const { Storage } = require("@google-cloud/storage");
const path = require("path");
require("dotenv").config();

// Kết nối với Google Cloud Storage bằng Service Account Key
const storage = new Storage({
  keyFilename: path.join(__dirname, "../google-cloud-key.json"), // Đường dẫn tới Service Account Key
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, // Project ID từ file .env
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Tên bucket từ file .env
const bucket = storage.bucket(bucketName);

// Helper: Upload một file lên Google Cloud Storage
const uploadFileToGCS = async (fileBuffer, fileName) => {
  try {
    const blob = bucket.file(fileName);
    return new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        reject(new Error(`Upload error: ${err.message}`));
      });

      blobStream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Helper: Upload nhiều file lên Google Cloud Storage
 */
const uploadMultipleFilesToGCS = async (files) => {
  try {
    console.log("files: ", files);
    const uploadPromises = files.map((file) =>
      uploadFileToGCS(file.buffer, file.originalname)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Helper: Lấy danh sách file từ bucket
const listFilesFromGCS = async () => {
  try {
    const [files] = await bucket.getFiles();
    return files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Helper: Xóa file khỏi bucket
const deleteFileFromGCS = async (fileName) => {
  try {
    await bucket.file(fileName).delete();
    return `File ${fileName} deleted successfully!`;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  uploadFileToGCS,
  uploadMultipleFilesToGCS,
  listFilesFromGCS,
  deleteFileFromGCS,
};
