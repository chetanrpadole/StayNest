import Listing from "../models/listing.js";

export const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

export const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

export const showListing = async (req, res) => {
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
};

export const createListing = async (req, res) => {
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
};

export const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

export const updateListing = async (req, res) => {
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
};

export const destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
