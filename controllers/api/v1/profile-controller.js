const Profile = require("../../../models/Profile");
const User = require("../../../models/User");

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

// fetch current user jobs info
module.exports.createJobs = function (req, res) {
   const profileFields = {};
   profileFields.user = req.user.id;
   if (req.body.company) profileFields.company = req.body.company;
   if (req.body.location) profileFields.location = req.body.location;
   if (req.body.bio) profileFields.bio = req.body.bio;
   if (req.body.status) profileFields.status = req.body.status;

   // Skills - Spilt into array
   profileFields.skills = Array.isArray(req.body.skills)
      ? req.body.skills
      : req.body.skills.split(",").map((skill) => " " + skill.trim());

   // console.log("PROFILE", Profile);

   new Profile(profileFields).save().then((profile) => {
      return res.status(200).json(profile);
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
