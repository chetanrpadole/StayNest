import express from "express";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressErrors.js";
import { reviewSchema } from "../schema.js";
import { isLoggedIn, isReviewAuthor } from "../middleware.js";

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
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  
  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();
  req.flash("success", "New review posted successfully!");
  res.redirect(`/listings/${listing._id}`);
}));

// Reviews — Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
}));

export default router;
