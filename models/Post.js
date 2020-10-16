const mongoose = require("mongoose");

// Defining the schema
const PostSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
   },
   text: {
      type: String,
      required: true,
   },
   name: {
      type: String,
   },
   avatar: {
      type: String,
   },
   handle: {
      type: String,
   },
   likes: [
      {
         user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
         },
      },
   ],
   comments: [
      {
         user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
         },
         text: {
            type: String,
            required: true,
         },
         name: {
            type: String,
         },
         avatar: {
            type: String,
         },
         handle: {
            type: String,
         },
         date: {
            type: Date,
            default: Date.now,
         },
      },
   ],
   date: {
      type: Date,
      default: Date.now,
   },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
