import Listing from "../models/listing.js";

export const index = async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.json({ success: true, listings: allListings });
};

export const showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found" });
  }
  res.json({ success: true, listing });
};

export const createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing || req.body);
  newListing.owner = req.user._id;

  // If an image file was uploaded via multer/Cloudinary
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();
  const populated = await Listing.findById(newListing._id).populate("owner");
  res.status(201).json({
    success: true,
    message: "New listing created successfully!",
    listing: populated,
  });
};

export const updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...(req.body.listing || req.body) },
    { new: true }
  );

  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found" });
  }

  // If a new image file was uploaded, update the image field
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  const updated = await Listing.findById(id).populate("owner");
  res.json({
    success: true,
    message: "Listing updated successfully!",
    listing: updated,
  });
};

export const destroyListing = async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Listing not found" });
  }
  res.json({ success: true, message: "Listing deleted successfully!" });
};
