import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressErrors.js";
import { reviewSchema } from "../schema.js";
import { isLoggedIn, isReviewAuthor } from "../middleware.js";
import * as reviewController from "../controller/reviews.js";

const router = express.Router({ mergeParams: true });

// Joi validation middleware
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Reviews — Create Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Reviews — Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

export default router;
