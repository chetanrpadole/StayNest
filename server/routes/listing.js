import express from "express";
import multer from "multer";
import { storage } from "../cloudConfig.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressErrors.js";
import { listingSchema } from "../schema.js";
import { isLoggedIn, isOwner } from "../middleware.js";
import * as listingController from "../controller/listing.js";

const router = express.Router();
const upload = multer({ storage });

// Joi validation middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Listings — Index Route & Create Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

// Listings — New Route (Form)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Listings — Show Route, Update Route & Delete Route
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Listings — Edit Route (Form)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

export default router;
