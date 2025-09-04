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

///middleware

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

app.get("/", (req, res) => {
  res.render("index.ejs")
});


// POST /blogposts
app.get("/posts", async (req, res) => {
  const allPosts = await Post.find();
  res.render("posts/index.ejs", { posts: allPosts });
});

app.get("/posts/new", (req, res) => {
  res.render("posts/new.ejs");
});


// POST /posts
app.post("/posts", async (req, res) => {
  if (req.body.isPosted === "on") {
    req.body.isPosted = true;
  } else {
    req.body.isPosted = false;
  }
  await Post.create(req.body);
  res.redirect("/posts"); // redirect to index posts
});

app.get("/posts/:postId", async (req, res) => {
  const foundPost = await Post.findById(req.params.postId);
  res.render("posts/show.ejs", { post: foundPost });
});

app.delete("/posts/:postId", async (req, res) => {
  await Post.findByIdAndDelete(req.params.postId);
  res.redirect("/posts");
});

app.get("/posts/:postId/edit", async (req, res) => {
  const foundPost = await Post.findById(req.params.postId);
    res.render("posts/edit.ejs", {
      post: foundPost

    });
});

app.put("/posts/:postId", async (req, res) => {
  
  if (req.body.isPosted === "on") {
    req.body.isPosted = true;
  } else {
    req.body.isPosted = false;
  }
  
  // Update the post in the database
  await Post.findByIdAndUpdate(req.params.postId, req.body);

  // Redirect to the post's show page to see the updates
  res.redirect(`/posts/${req.params.postId}`);
});



app.listen(3000, () => {
  console.log("Listening on port 3000");
});
