// models/fruit.js

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  isPosted: Boolean
});

const Post = mongoose.model("Post", postSchema); // create model

module.exports = Post;