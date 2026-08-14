import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import * as userController from "../controller/users.js";
import { isLoggedIn } from "../middleware.js";

const router = express.Router();

// Signup Route
router.post("/signup", wrapAsync(userController.signup));

// Login Route
router.post("/login", wrapAsync(userController.login));

// Get current user route (to verify JWT tokens)
router.get("/me", isLoggedIn, wrapAsync(userController.getCurrentUser));

export default router;
