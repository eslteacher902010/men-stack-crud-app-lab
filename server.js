const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");

const Post = require("./models/post.js");

const app = express();
app.set("view engine", "ejs");

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// serve static files like CSS/images
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome, friend!");
});


// POST /blogposts
app.get("/posts", async (req, res) => {
  const allPosts = await Post.find();
  res.render("posts/index.ejs", { posts: allPosts });
});

app.get("/posts/new", (req, res) => {
  res.render("posts/new.ejs");
});


// POST /fruits
app.post("/posts", async (req, res) => {
  if (req.body.isPosted === "on") {
    req.body.isPosted = true;
  } else {
    req.body.isPosted = false;
  }
  await Fruit.create(req.body);
  res.redirect("/posts"); // redirect to index fruits
});


app.listen(3000, () => {
  console.log("Listening on port 3000");
});
