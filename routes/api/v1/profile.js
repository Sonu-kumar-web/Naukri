const express = require("express");
const router = express.Router();
const passport = require("passport");
const profileController = require("../../../controllers/api/v1/profile-controller");

router.get(
   "/",
   passport.authenticate("jwt", { session: false }),
   profileController.fetchProfile
);

router.post(
   "/create-profile",
   passport.authenticate("jwt", { session: false }),
   profileController.createProfile
);

router.get("/all", profileController.returnAllProfile);

router.get("/:user_id", profileController.getProfileByUserId);

router.post(
   "/experience",
   passport.authenticate("jwt", { session: false }),
   profileController.addExprience
);

router.post(
   "/education",
   passport.authenticate("jwt", { session: false }),
   profileController.addEducation
);

router.delete(
   "/experience/:exp_id",
   passport.authenticate("jwt", { session: false }),
   profileController.deleteExprience
);

router.delete(
   "/education/:edu_id",
   passport.authenticate("jwt", { session: false }),
   profileController.deleteEducation
);

router.delete(
   "/",
   passport.authenticate("jwt", { session: false }),
   profileController.deleteUserAndProfile
);

module.exports = router;
