import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressErrors.js";
import { reviewSchema } from "../schema.js";
import { isLoggedIn, isReviewAuthor } from "../middleware.js";
import * as reviewController from "../controller/reviews.js";

const router = express.Router({ mergeParams: true });

// Joi validation middleware
const validateReview = (req, res, next) => {
  let dataToValidate = req.body;
  if (!req.body.review && req.body.comment) {
    dataToValidate = { review: req.body };
  }
  let { error } = reviewSchema.validate(dataToValidate);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    if (!req.body.review && req.body.comment) {
      req.body.review = req.body;
    }
    next();
  }
};

// Reviews — Create Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Reviews — Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

export default router;
