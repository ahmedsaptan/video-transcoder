const express = require("express");
const router = express.Router();
const { transcodeVideo, getVideo } = require("../controllers/video.controller");
const multer = require("../services/multer.service");

router.post("/", multer().single("video"), transcodeVideo);
router.get("/:videoId", getVideo);
module.exports = router;
