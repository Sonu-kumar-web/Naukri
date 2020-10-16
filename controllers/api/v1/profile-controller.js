const Profile = require("../../../models/Profile");
const User = require("../../../models/User");
const Post = require("../../../models/Post");

// Load Validation
// const validateProfileInput = require("../../../validation/profile
// const validateExperienceInput = require("../../../validation/experience
// const validateEducationInput = require("../../../validation/education

// fetch current user profile info
module.exports.fetchProfile = function (req, res) {
   const errors = {};

   // console.log("Fetch profile", req.user);

   Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
         if (!profile) {
            errors.message = "There is no profile for this user";
            return res.status(404).json(errors);
         }
         return res.status(200).json(profile);
      })
      .catch((err) => {
         return res.status(404).json(err);
      });
};

// fetch current user profile info
module.exports.createProfile = function (req, res) {
   //  const { errors, isValid } = validateProfileInput(req.body);

   // Check Validation
   //  if (!isValid) {
   // Return any errors with 400 status
   // return res.status(400).json(errors);
   //  }
   // Get fields
   // console.log("Create Router", req.body);
   const profileFields = {};
   profileFields.user = req.user.id;
   if (req.body.company) profileFields.company = req.body.company;
   if (req.body.website) profileFields.website = req.body.website;
   if (req.body.location) profileFields.location = req.body.location;
   if (req.body.bio) profileFields.bio = req.body.bio;
   if (req.body.status) profileFields.status = req.body.status;
   if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

   // Skills - Spilt into array
   profileFields.skills = Array.isArray(req.body.skills)
      ? req.body.skills
      : req.body.skills.split(",").map((skill) => " " + skill.trim());

   // Social
   profileFields.social = {};
   if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
   if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
   if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
   if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
   if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

   Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
         // Update
         Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
         ).then((profile) => {
            return res.status(200).json(profile);
         });
      } else {
         // Create

         // Save Profile
         new Profile(profileFields).save().then((profile) => {
            return res.status(200).json(profile);
         });
      }
   });
};

// Get all profiles
module.exports.returnAllProfile = function (req, res) {
   const errors = {};

   Profile.find()
      .populate("user", ["name", "avatar"])
      .then((profiles) => {
         if (!profiles) {
            errors.noprofile = "There are no profiles";
            return res.status(404).json(errors);
         }

         return res.status(200).json(profiles);
      })
      .catch((err) => {
         return res.status(404).json({ profile: "There are no profiles" });
      });
};

// Get profile by user ID
module.exports.getProfileByUserId = function (req, res) {
   const errors = {};

   Profile.findOne({ user: req.params.user_id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
         if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
         }

         return res.status(200).json(profile);
      })
      .catch((err) => {
         return res
            .status(404)
            .json({ profile: "There is no profile for this user" });
      });
};

// Add experience to profile
module.exports.addExprience = function (req, res) {
   //  const { errors, isValid } = validateExperienceInput(req.body);

   // Check Validation
   //  if (!isValid) {
   // Return any errors with 400 status
   // return res.status(400).json(errors);
   //  }

   Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
         title: req.body.title,
         company: req.body.company,
         location: req.body.location,
         from: req.body.from,
         to: req.body.to,
         current: req.body.current,
         description: req.body.description,
      };

      // Add to experience  array
      profile.experience.unshift(newExp);

      profile.save().then((profile) => {
         // console.log("Add experience Router", profile);

         return res.status(200).json(profile);
      });
   });
};

// Add education to profile
module.exports.addEducation = async function (req, res) {
   //  const { errors, isValid } = validateEducationInput(req.body);

   // Check Validation
   //  if (!isValid) {
   // Return any errors with 400 status
   // return res.status(400).json(errors);
   //  }

   Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
         school: req.body.school,
         degree: req.body.degree,
         fieldofstudy: req.body.fieldofstudy,
         from: req.body.from,
         to: req.body.to,
         current: req.body.current,
         description: req.body.description,
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then((profile) => {
         return res.status(200).json(profile);
      });
   });
};

// Delete experience from profile
module.exports.deleteExprience = function (req, res) {
   Profile.findOne({ user: req.user.id })
      .then((profile) => {
         // Get remove index
         const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);

         // Splice out of array
         profile.experience.splice(removeIndex, 1);

         // Save
         profile.save().then((profile) => {
            return res.status(200).json(profile);
         });
      })
      .catch((err) => {
         return res.status(404).json(err);
      });
};

// Delete education from profile
module.exports.deleteEducation = function (req, res) {
   Profile.findOne({ user: req.user.id })
      .then((profile) => {
         // Get remove index
         const removeIndex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.edu_id);

         // Splice out of array
         profile.education.splice(removeIndex, 1);

         // Save
         profile.save().then((profile) => {
            return res.status(200).json(profile);
         });
      })
      .catch((err) => {
         return res.status(404).json(err);
      });
};

// Delete user and profile
module.exports.deleteUserAndProfile = function (req, res) {
   // Remove Posts
   Post.deleteMany({ user: req.user.id }).then(() => {
      // Remove Profile
      Profile.findOneAndRemove({ user: req.user.id }).then(() => {
         // Remove User
         User.findOneAndRemove({ _id: req.user.id }).then(() => {
            return res.status(200).json({ success: true });
         });
      });
   });
};
