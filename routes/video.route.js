const express = require("express");
const router = express.Router();
const { transcodeVideo } = require("../controllers/video.controller");
const multer = require("../services/multer.service");

router.post("/", multer().single("video"), transcodeVideo);

module.exports = router;
