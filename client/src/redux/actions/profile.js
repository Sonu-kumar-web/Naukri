import axios from "axios";
import { setAlert } from "./alert";

import {
   CLEAR_PROFILE,
   GET_PROFILE,
   GET_PROFILES,
   PROFILE_ERROR,
   UPDATE_PROFILE,
   ACCOUNT_DELETED,
} from "./types";

// Get the current user profile
export const getCurrentProfile = () => async (dispatch) => {
   try {
      const res = await axios.get("/api/v1/profile/");
      // console.log("Current profile", res);
      dispatch({
         type: GET_PROFILE,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
   // Clear Single user profile before get all profiles
   dispatch({
      type: CLEAR_PROFILE,
   });

   try {
      const res = await axios.get("/api/v1/profile/all");
      // console.log("Current profile", res.data);
      dispatch({
         type: GET_PROFILES,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Get all profile by ID
export const getProfileById = (userId) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/v1/profile/${userId}`);
      // console.log("Current profile", res);
      dispatch({
         type: GET_PROFILE,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Create or update a profile
export const createProfile = (formData, history, edit = false) => async (
   dispatch
) => {
   try {
      let res = await axios.post("/api/v1/profile/create-profile", formData);
      // console.log("Profile Creation", res);
      // console.log("Create profile token", localStorage.token);

      // console.log("Header", axios.defaults.headers.common["Authorization"]);

      dispatch({
         type: GET_PROFILE,
         payload: res.data,
      });

      if (res) {
         dispatch(
            setAlert(edit ? "Profile Updated" : "Profile Created", "success")
         );
      }

      if (!edit) {
         history.push("/dashboard");
      }
   } catch (err) {
      console.log("Profile Creation Error", err.response.data);

      if (err) {
         dispatch(setAlert(err.response.data.message, "danger"));
      }
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Add Experience
export const addExperience = (formData, history) => async (dispatch) => {
   try {
      let res = await axios.post("/api/v1/profile/experience", formData);
      // console.log("AddExp.Form Action", res);

      // console.log("Create profile token", localStorage.token);

      // console.log("Header", axios.defaults.headers.common["Authorization"]);

      dispatch({
         type: UPDATE_PROFILE,
         payload: res.data,
      });

      if (res) {
         dispatch(setAlert("Experience Added", "success"));
      }

      history.push("/dashboard");
   } catch (err) {
      console.log("Profile Creation Error", err.response);

      if (err) {
         dispatch(setAlert(err.response.data.message, "danger"));
      }
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Add Education
export const addEducation = (formData, history) => async (dispatch) => {
   try {
      let res = await axios.post("/api/v1/profile/education", formData);

      dispatch({
         type: UPDATE_PROFILE,
         payload: res.data,
      });

      if (res) {
         dispatch(setAlert("Education Added", "success"));
      }

      history.push("/dashboard");
   } catch (err) {
      // console.log("Profile Creation Error", err.response);

      if (err) {
         dispatch(setAlert(err.response.data.message, "danger"));
      }
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Delete experience
export const deleteExperience = (id) => async (dispatch) => {
   try {
      const res = await axios.delete(`/api/v1/profile/experience/${id}`);
      dispatch({
         type: UPDATE_PROFILE,
         payload: res.data,
      });

      if (res) {
         dispatch(setAlert("Experience Removed", "success"));
      }
   } catch (err) {
      if (err) {
         dispatch(setAlert(err.response.data.message, "danger"));
      }
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
   try {
      const res = await axios.delete(`/api/v1/profile/education/${id}`);
      // console.log("Run deleteEducation");
      dispatch({
         type: UPDATE_PROFILE,
         payload: res.data,
      });

      if (res) {
         dispatch(setAlert("Education Removed", "success"));
      }
   } catch (err) {
      if (err) {
         dispatch(setAlert(err.response.data.message, "danger"));
      }
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, status: err.response.status },
      });
   }
};

// Delete Account and profile
export const deleteAccount = () => async (dispatch) => {
   // It is dangerous task so it is a conformation message
   if (window.confirm("Are you sure? This can not be undone")) {
      try {
         const res = await axios.delete("/api/v1/profile");
         dispatch({
            type: CLEAR_PROFILE,
         });

         dispatch({
            type: ACCOUNT_DELETED,
         });

         if (res) {
            dispatch(
               setAlert("Your account has been permanently deleted", "danger")
            );
         }
      } catch (err) {
         if (err) {
            dispatch(setAlert(err.response.data.message, "danger"));
         }
         dispatch({
            type: PROFILE_ERROR,
            payload: {
               msg: err.response.statusText,
               status: err.response.status,
            },
         });
      }
   }
};
