import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const MONGO_URL = "mongodb://127.0.0.1:27017/majorproject";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listingData = { ...req.body.listing };
  let imageUrl = listingData.image;
  delete listingData.image; 

  const updatedListing = await Listing.findByIdAndUpdate(id, listingData);
  if (imageUrl) {
    updatedListing.image = { url: imageUrl, filename: "listingimage" };
    await updatedListing.save();
  }

  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.post("/listings", async (req, res) => {
  let listingData = { ...req.body.listing };
  let imageUrl = listingData.image;
  delete listingData.image; // Prevent cast error since schema expects an object

  let newListing = new Listing(listingData);
  
  if (imageUrl) {
    newListing.image = { url: imageUrl, filename: "listingimage" };
  } else {
    newListing.image = undefined; // Trigger default
  }

  await newListing.save();
  res.redirect("/listings");
});

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My New Villa",
    description: "By the beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });

  await sampleListing.save();
  console.log("sample was saved");
  res.send("successful testing");
});
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});