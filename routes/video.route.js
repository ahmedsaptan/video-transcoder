const express = require("express");
const router = express.Router();
const {
  transcodeVideo,
  getVideo,
  checkTranscoded,
  validateOnCreate,
} = require("../controllers/video.controller");
const multer = require("../services/multer.service");

router.post("/", multer().single("video"), validateOnCreate(), transcodeVideo);
router.get("/check-transcoded/:videoId", checkTranscoded);
router.get("/:videoId", getVideo);
module.exports = router;
