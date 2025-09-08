// Centralized error handler. Always returns a JSON response.
// Logs stack traces except during tests.
export const errorHandler = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  if (process.env.NODE_ENV !== "test") {
    console.error(
      `[Error] ${req.method} ${req.originalUrl} -> ${status}:`,
      err.stack || err.message
    );
  }
  res.status(status).json({
    success: false,
    error: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
