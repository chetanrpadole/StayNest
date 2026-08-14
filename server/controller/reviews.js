import Listing from "../models/listing.js";
import Review from "../models/review.js";

export const createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found" });
  }
  
  let newReview = new Review(req.body.review || req.body);
  newReview.author = req.user._id;
  
  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();
  
  // Populate the author so the frontend gets it immediately
  const populatedReview = await Review.findById(newReview._id).populate("author");
  
  res.status(201).json({
    success: true,
    message: "New review posted successfully!",
    review: populatedReview
  });
};

export const destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  
  res.json({
    success: true,
    message: "Review deleted successfully!"
  });
};
