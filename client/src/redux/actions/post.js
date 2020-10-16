import axios from "axios";

import { setAlert } from "./alert";
import {
   GET_POSTS,
   GET_POST,
   POST_ERROR,
   UPDATE_LIKES,
   DELETE_POST,
   ADD_POST,
   ADD_COMMENT,
   REMOVE_COMMENT,
} from "./types";

// Get posts
export const getPosts = () => async (dispatch) => {
   try {
      const res = await axios.get("/api/v1/posts");
      // console.log("Posts", res.data.name);
      dispatch({
         type: GET_POSTS,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Add Like
export const addLike = (id) => async (dispatch) => {
   try {
      const res = await axios.post(`/api/v1/posts/like/${id}`);
      // console.log("Likes Post", res.data);
      dispatch({
         type: UPDATE_LIKES,
         payload: { id, likes: res.data },
      });
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Remove Like
export const removeLike = (id) => async (dispatch) => {
   try {
      const res = await axios.post(`/api/v1/posts/unlike/${id}`);
      dispatch({
         type: UPDATE_LIKES,
         payload: { id, likes: res.data },
      });
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Delete a post
export const deletePost = (id) => async (dispatch) => {
   try {
      const res = await axios.delete(`/api/v1/posts/${id}`);
      dispatch({
         type: DELETE_POST,
         payload: id,
      });

      dispatch(setAlert("Post Removed", "success"));
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Add Post
export const addPost = (formData) => async (dispatch) => {
   try {
      const res = await axios.post("/api/v1/posts", formData);
      // console.log("Posts", res);
      dispatch({
         type: ADD_POST,
         payload: res.data,
      });

      dispatch(setAlert("Post Created", "success"));
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Get post
export const getPost = (id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/v1/posts/${id}`);
      // console.log("Posts", res.data);
      dispatch({
         type: GET_POST,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: { msg: err.response, status: err.response },
      });
   }
};

// Add Comment to post
export const addComment = (postId, formData) => async (dispatch) => {
   try {
      const res = await axios.post(`/api/v1/posts/comment/${postId}`, formData);
      // console.log("Posts", res.data.comments);
      dispatch({
         type: ADD_COMMENT,
         payload: res.data.comments,
      });

      dispatch(setAlert("Comment Added", "success"));
   } catch (err) {
      console.log("Comment error", err);
      dispatch({
         type: POST_ERROR,
         payload: { msg: err.response, status: err.response },
      });
   }
};

// Add Comment from post
export const deleteComment = (postId, commentId) => async (dispatch) => {
   try {
      const res = await axios.delete(
         `/api/v1/posts/comment/${postId}/${commentId}`
      );
      // console.log("Posts", res);
      dispatch({
         type: REMOVE_COMMENT,
         payload: commentId,
      });

      dispatch(setAlert("Comment Removed", "success"));
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};
