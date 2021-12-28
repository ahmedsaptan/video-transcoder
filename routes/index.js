const express = require("express");
const router = express.Router();

router.use("/video", require("./video.route"));
router.use("/application", require("./application.route"));
module.exports = router;
