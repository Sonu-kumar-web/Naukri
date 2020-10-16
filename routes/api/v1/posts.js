const express = require("express");
const router = express.Router();
const passport = require("passport");
const postController = require("../../../controllers/api/v1/posts-controller");

// Get posts
router.get("/", postController.fetchAllPosts);

//Get post by id
router.get("/:id", postController.getPostById);

// Create Post
router.post(
   "/",
   passport.authenticate("jwt", { session: false }),
   postController.createPost
);

// Delete post
router.delete(
   "/:id",
   passport.authenticate("jwt", { session: false }),
   postController.deletePost
);

// Like post
router.post(
   "/like/:id",
   passport.authenticate("jwt", { session: false }),
   postController.likePost
);

// Unlike post
router.post(
   "/unlike/:id",
   passport.authenticate("jwt", { session: false }),
   postController.unlikePost
);

// Add comment to post
router.post(
   "/comment/:id",
   passport.authenticate("jwt", { session: false }),
   postController.addCommentToPost
);

// Remove comment from post
router.delete(
   "/comment/:id/:comment_id",
   passport.authenticate("jwt", { session: false }),
   postController.removeCommentFromPost
);

module.exports = router;
