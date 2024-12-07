const { uploadMultipleFilesFromBodyToGCS, listFilesInGCS, deleteFileFromGCS } = require('../helpers/upload');

// Controller: Tải file lên bucket

exports.uploadMultipleFilesFromBody = async (req, res) => {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: 'No files provided in request body.' });
    }

    // Gọi helper để upload danh sách file
    const uploadedFiles = await uploadMultipleFilesFromBodyToGCS(files);

    res.status(200).json({
      message: 'Files uploaded successfully!',
      files: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Controller: Lấy danh sách tệp trong bucket
exports.listFiles = async (req, res) => {
  try {
    const fileList = await listFilesInGCS();
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
    await deleteFileFromGCS(filename);
    res.status(200).json({ message: `File ${filename} deleted successfully!` });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
