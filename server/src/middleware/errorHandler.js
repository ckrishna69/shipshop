export function errorHandler(err, req, res, next) {
  console.error(err);

  let status = err.status || 500;
  let message = err.publicMessage || err.message || "Something went wrong. Try again.";

  // Handle Prisma errors gracefully
  if (err.code && err.code.startsWith("P2")) {
    status = 400;
    if (err.code === "P2002") {
      message = "A record with this database constraint already exists.";
    } else if (err.code === "P2025") {
      message = "Database record not found.";
    } else {
      message = `Database error: ${err.code}`;
    }
  }

  res.status(status).json({
    success: false,
    message,
    error: message
  });
}
