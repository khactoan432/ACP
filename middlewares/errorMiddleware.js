const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message); // Ghi log lỗi trên console

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Đã xảy ra lỗi trên server.",
    },
  });
};

module.exports = errorMiddleware;
