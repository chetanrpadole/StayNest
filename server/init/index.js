import mongoose from "mongoose";
import { data as initData } from "./data.js";
import Listing from "../models/listing.js";
import User from "../models/user.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/majorproject";

main()
  .then(() => {
    console.log("connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    
    // Find an existing user or fallback to a placeholder ObjectId
    const defaultUser = await User.findOne({});
    const ownerId = defaultUser ? defaultUser._id : new mongoose.Types.ObjectId("665389cb432ef1cfbd2d7a22");

    const listingsWithOwner = initData.map((obj) => ({
      ...obj,
      owner: ownerId,
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log("data was initialized");
  } catch (err) {
    console.error("Error initializing DB:", err);
  } finally {
    mongoose.connection.close();
  }
};
