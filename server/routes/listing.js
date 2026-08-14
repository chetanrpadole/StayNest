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
  // Since request body might contain nested listing object or be flat, Joi schema check:
  // Joi schema currently expects { listing: { title, ... } }
  let dataToValidate = req.body;
  if (!req.body.listing && req.body.title) {
    dataToValidate = { listing: req.body };
  }
  let { error } = listingSchema.validate(dataToValidate);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    // If it was flat, let's restructure it to be consistent with controller
    if (!req.body.listing && req.body.title) {
      req.body.listing = req.body;
    }
    next();
  }
};

// Listings — Index Route & Create Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("image"), validateListing, wrapAsync(listingController.createListing));

// Listings — Show Route, Update Route & Delete Route
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

export default router;
