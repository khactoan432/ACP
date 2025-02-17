const {
  uploadFileToGCS,
  uploadMultipleFilesToGCS,
  listFilesFromGCS,
  deleteFileFromGCS,
} = require("../helpers/googleCloudStorage");

// Controller: Tải file lên bucket
exports.uploadFiles = async (req, res) => {
  try {
    const { folderPath } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded!" });
    }

    const publicUrls = await uploadMultipleFilesToGCS(files, folderPath);

    res.status(200).json({
      message: "Files uploaded successfully!",
      urls: publicUrls,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed!", error: error.message });
  }
};

// Controller: Lấy danh sách tệp trong bucket
exports.listFiles = async (req, res) => {
  try {
    // Sử dụng helper để lấy danh sách file
    const fileList = await listFilesFromGCS();

    res.status(200).json({
      message: "File list retrieved successfully!",
      files: fileList,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Controller: Xóa file khỏi bucket
exports.deleteFile = async (req, res) => {
  const { filename } = req.params;

  try {
    // Sử dụng helper để xóa file
    const message = await deleteFileFromGCS(filename);

    res.status(200).json({ message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
