import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./utils/generateToken.js";
import Listing from "./models/listing.js";
import Review from "./models/review.js";
import User from "./models/user.js";

// JWT authentication middleware
export const isLoggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "You must be logged in" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Check if current user is the owner of a listing
export const isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    if (!listing.owner || !listing.owner.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "You are not the owner of this listing" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Check if current user is the author of a review
export const isReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (!review.author || !review.author.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "You did not create this review" });
    }
    next();
  } catch (err) {
    next(err);
  }
};
