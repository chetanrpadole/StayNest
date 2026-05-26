import express from "express";
import usersRouter from "./routes/user.js";
import postsRouter from "./routes/post.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

// Mount classroom routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Express Router Classroom Practice App!");
});

app.listen(3000, () => {
  console.log("Classroom server is listening on port 3000");
});
