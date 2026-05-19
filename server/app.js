import express from "express";
import mongoose from "mongoose";

const app = express();

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

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});