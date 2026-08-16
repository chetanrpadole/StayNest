import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ExpressError from "./utils/ExpressErrors.js";

// Import Routers
import listingsRouter from "./routes/listing.js";
import reviewsRouter from "./routes/review.js";
import userRouter from "./routes/user.js";

const app = express();

// CORS — allow frontend origin
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "StayNest API is running" });
});

// Mount API Routers
app.use("/api/auth", userRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/listings/:id/reviews", reviewsRouter);

// 404 — catch-all for unmatched API routes
app.all("/api/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "API endpoint not found"));
});

// Error-handling middleware — return JSON
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  res.status(statusCode).json({ success: false, message });
});

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/majorproject";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`StayNest API is listening on port ${PORT}`);
});