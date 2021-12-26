const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes");
const ROOT_APP_PATH = __dirname;
const UPLOADED_VIDEOS_FILES_PATH = path.join(
  ROOT_APP_PATH,
  "uploads",
  "videos"
);
const TRANSCODED_VIDEOS_FILES_PATH = path.join(
  ROOT_APP_PATH,
  "uploads",
  "transcodedVideos"
);

const TEMP_UPLOAD_FILES = path.join(ROOT_APP_PATH, "uploads", "temp");
console.log(TEMP_UPLOAD_FILES);
global.TEMP_UPLOAD_FILES = TEMP_UPLOAD_FILES;
global.UPLOADED_VIDEOS_FILES_PATH = UPLOADED_VIDEOS_FILES_PATH;
global.TRANSCODED_VIDEOS_FILES_PATH = TRANSCODED_VIDEOS_FILES_PATH;

console.log("ensure");
// check to see videos uploads, transcoded videos exist and create them if not
require("./helpers/checkFolders").checkUploadesFolders();

// database connections
require("./models");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(
  "/uploads/transcodedVideos",
  express.static(TRANSCODED_VIDEOS_FILES_PATH)
);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/index.html"));
});
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

module.exports = app;
