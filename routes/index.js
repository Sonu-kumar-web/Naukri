const express = require("express");
const router = express.Router();

router.use("/api", require("./api/index.js"));
router.get("/sonu", (req, res) => res.send("hello"));

module.exports = router;
