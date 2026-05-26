import Listing from "./models/listing.js";
import Review from "./models/review.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; // Clean up the session
  }
  next();
};

export const isOwner = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const isReviewAuthor = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review does not exist!");
      return res.redirect(`/listings/${id}`);
    }
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You did not create this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};
