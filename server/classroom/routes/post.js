import express from "express";

const router = express.Router();

// Mock Post Routes
// Index - GET /posts
router.get("/", (req, res) => {
  res.send("GET for posts index");
});

// Show - GET /posts/:id
router.get("/:id", (req, res) => {
  res.send("GET for post show detail");
});

// Create - POST /posts
router.post("/", (req, res) => {
  res.send("POST for creating a new post");
});

// Delete - DELETE /posts/:id
router.delete("/:id", (req, res) => {
  res.send("DELETE for removing a post");
});

export default router;
