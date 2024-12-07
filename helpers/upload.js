const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();

// Kết nối với Google Cloud Storage bằng Service Account Key
const storage = new Storage({
  keyFilename: path.join(__dirname, '../google-cloud-key.json'), // Đường dẫn tới Service Account Key
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, // Project ID
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Tên bucket
const bucket = storage.bucket(bucketName);

const uploadFileFromBodyToGCS = async (fileBuffer, fileName) => {
  try {
    const blob = bucket.file(fileName);
    return new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        reject(new Error(`Upload error: ${err.message}`));
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const uploadMultipleFilesFromBodyToGCS = async (files) => {
  const results = [];

  for (const file of files) {
    const { fileName, fileData } = file;

    if (!fileName || !fileData) {
      throw new Error('Each file must have fileName and fileData.');
    }

    // Decode Base64 file data thành buffer
    const fileBuffer = Buffer.from(fileData, 'base64');

    // Upload từng file và lưu kết quả
    const publicUrl = await uploadFileFromBodyToGCS(fileBuffer, fileName);
    results.push({ fileName, url: publicUrl });
  }

  return results;
};

/**
 * Lấy danh sách file trong Google Cloud Storage bucket
 * @returns {Promise<Array>} - Danh sách file
 */
const listFilesInGCS = async () => {
  const [files] = await bucket.getFiles();
  return files.map((file) => ({
    name: file.name,
    url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
  }));
};

/**
 * Xóa file khỏi Google Cloud Storage bucket
 * @param {string} fileName - Tên file cần xóa
 * @returns {Promise<void>}
 */
const deleteFileFromGCS = async (fileName) => {
  await bucket.file(fileName).delete();
};

module.exports = {
  uploadFileFromBodyToGCS,
  uploadMultipleFilesFromBodyToGCS,
  listFilesInGCS,
  deleteFileFromGCS,
};
