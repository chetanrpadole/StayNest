import express from "express";
import passport from "passport";
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import { saveRedirectUrl } from "../middleware.js";

const router = express.Router();

// GET /signup — render signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// POST /signup — register a new user
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, password } = req.body;
      const newUser = new User({ username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to StayNest!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// GET /login — render login form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// POST /login — authenticate user
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to StayNest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

// GET /logout — log out user
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});

export default router;
