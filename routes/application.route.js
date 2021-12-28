const express = require("express");
const router = express.Router();
const {
  createApplication,
  validateCreateApp,
} = require("../controllers/application.controller");

router.post("/", validateCreateApp(), createApplication);
// router.get("/:videoId", getVideo);
module.exports = router;
