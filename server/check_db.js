import mongoose from "mongoose";
import Listing from "./models/listing.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/majorproject";

async function check() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    const count = await Listing.countDocuments({});
    console.log(`Total listings in DB: ${count}`);
    const listings = await Listing.find({}).limit(3);
    console.log("Sample listings:", JSON.stringify(listings, null, 2));
  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

check();
