import express from "express";
import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressErrors.js";
import { listingSchema } from "../schema.js";
import { isLoggedIn, isOwner } from "../middleware.js";

const router = express.Router();

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
  .get(wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }))
  .post(isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let listingData = { ...req.body.listing };
    let imageUrl = listingData.image;
    delete listingData.image; // Prevent cast error since schema expects an object

    let newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    
    if (imageUrl) {
      newListing.image = { url: imageUrl, filename: "listingimage" };
    } else {
      newListing.image = undefined; // Trigger default
    }

    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  }));

// Listings — New Route (Form)
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Listings — Show Route, Update Route & Delete Route
router.route("/:id")
  .get(wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listingData = { ...req.body.listing };
    let imageUrl = listingData.image;
    delete listingData.image; 

    const updatedListing = await Listing.findByIdAndUpdate(id, listingData);
    if (imageUrl) {
      updatedListing.image = { url: imageUrl, filename: "listingimage" };
      await updatedListing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  }))
  .delete(isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  }));

// Listings — Edit Route (Form)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

export default router;
