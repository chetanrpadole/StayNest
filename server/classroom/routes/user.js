import express from "express";

const router = express.Router();

// Mock User Routes
// Index - GET /users
router.get("/", (req, res) => {
  res.send("GET for users index");
});

// Show - GET /users/:id
router.get("/:id", (req, res) => {
  res.send("GET for user show detail");
});

// Create - POST /users
router.post("/", (req, res) => {
  res.send("POST for creating a new user");
});

// Delete - DELETE /users/:id
router.delete("/:id", (req, res) => {
  res.send("DELETE for removing a user");
});

export default router;
