const express = require("express");
const router = express.Router();
const { transcodeVideo } = require("../controllers/video.controller");

// router.use("/video", transcodeVideo);

module.exports = router;
