const Post = require("../../../models/Post");
const Profile = require("../../../models/Profile");

// Load Validation
// const validatePostInput = require("../../../validation/post");

// Get posts
module.exports.fetchAllPosts = (req, res) => {
   Post.find()
      .sort({ date: -1 })
      .then((posts) => {
         res.json(posts);
      })
      .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
};

// Get post by id
module.exports.getPostById = (req, res) => {
   Post.findById(req.params.id)
      .then((post) => res.json(post))
      .catch((err) =>
         res.status(404).json({ nopostfound: "No post found with that ID" })
      );
};

// Create Post
module.exports.createPost = async function (req, res) {
   try {
      // const { errors, isValid } = await validatePostInput(req.body);

      // Check Validation
      // if (!isValid) {
      // If any errors, send 400 with errors object
      // return res.status(400).json(errors);
      // }

      const findHandle = await Profile.findOne({ user: req.user });
      const newPost = await Post.create({
         text: req.body.text,
         name: req.user.name,
         avatar: req.user.avatar,
         user: req.user.id,
         handle: findHandle ? findHandle.handle : "not-found",
      });
      return res.status(200).json(newPost);
   } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error!" });
   }
};

// @desc    Delete post
module.exports.deletePost = (req, res) => {
   Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
         .then((post) => {
            // Check for post owner
            if (post.user.toString() !== req.user.id) {
               return res
                  .status(401)
                  .json({ notAuthorized: "User not authorized" });
            }

            // Delete
            post.remove().then(() => res.json({ success: true }));
         })
         .catch((err) =>
            res.status(404).json({ postNotFound: "No post found" })
         );
   });
};

//  Like post
module.exports.likePost = async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      // Check if the post has already been liked
      if (post.likes.some((like) => like.user.toString() === req.user.id)) {
         return res.status(400).json({ msg: "Post already liked" });
      }

      post.likes.unshift({ user: req.user.id });

      await post.save();

      return res.json(post.likes);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
};

// Unlike post
module.exports.unlikePost = (req, res) => {
   Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
         .then((post) => {
            if (
               post.likes.filter((like) => like.user.toString() === req.user.id)
                  .length === 0
            ) {
               return res
                  .status(400)
                  .json({ notliked: "You have not yet liked this post" });
            }

            // Get remove index
            const removeIndex = post.likes
               .map((item) => item.user.toString())
               .indexOf(req.user.id);

            // Splice out of array
            post.likes.splice(removeIndex, 1);

            // Save
            post.save().then((post) => res.json(post));
         })
         .catch((err) =>
            res.status(404).json({ postnotfound: "No post found" })
         );
   });
};

// Add comment to post
module.exports.addCommentToPost = async function (req, res) {
   try {
      // const { errors, isValid } = await validatePostInput(req.body);

      // Check Validation
      // if (!isValid) {
      // If any errors, send 400 with errors object
      // return res.status(400).json(errors);
      // }

      const post = await Post.findById(req.params.id);
      const findHandle = await Post.findOne({ user: req.user });
      const newComment = {
         text: req.body.text,
         name: req.user.name,
         avatar: req.user.avatar,
         user: req.user.id,
         handle: findHandle ? findHandle.handle : "not-found",
      };

      // Add to comments array
      await post.comments.unshift(newComment);

      // Save
      await post.save();
      return res.json(post);
   } catch (error) {
      return res.status(404).json({ postnotfound: "No post found" });
   }
};

// Remove comment from post
module.exports.removeCommentFromPost = (req, res) => {
   Post.findById(req.params.id)
      .then((post) => {
         // Check to see if comment exists
         if (
            post.comments.filter(
               (comment) => comment._id.toString() === req.params.comment_id
            ).length === 0
         ) {
            return res
               .status(404)
               .json({ commentnotexists: "Comment does not exist" });
         }

         // Get remove index
         const removeIndex = post.comments
            .map((item) => item._id.toString())
            .indexOf(req.params.comment_id);

         // Splice comment out of array
         post.comments.splice(removeIndex, 1);

         post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
};
