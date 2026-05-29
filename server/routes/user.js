import express from "express";
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import { saveRedirectUrl } from "../middleware.js";
import * as userController from "../controller/users.js";

const router = express.Router();

// GET /signup — render signup form
router.get("/signup", userController.renderSignupForm);

// POST /signup — register a new user
router.post("/signup", wrapAsync(userController.signup));

// GET /login — render login form
router.get("/login", userController.renderLoginForm);

// POST /login — authenticate user
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// GET /logout — log out user
router.get("/logout", userController.logout);

export default router;
