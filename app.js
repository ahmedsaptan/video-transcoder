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
console.log("env", process.env.NODE_ENV);
global.DEV = process.env.NODE_ENV !== "production";
global.TEMP_UPLOAD_FILES = TEMP_UPLOAD_FILES;
global.UPLOADED_VIDEOS_FILES_PATH = UPLOADED_VIDEOS_FILES_PATH;
global.TRANSCODED_VIDEOS_FILES_PATH = TRANSCODED_VIDEOS_FILES_PATH;
global.APP = "https://ma-sharaf.com";
console.log("ensure");
// check to see videos uploads, transcoded videos exist and create them if not
require("./helpers/checkFolders").checkUploadesFolders();

// database connections
require("./models");
const Application = require("./models/app.model");
const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(
  "/uploads/transcodedVideos",
  async (req, res, next) => {
    console.log("transcodedVideos");
    const user_agent = req.headers["user-agent"];
    if (!user_agent) {
      return next(createError(403, "user-agent is required"));
    }
    console.log("user_agent", user_agent);
    console.log("req.path", req.path);
    const path = req.path.trim().split("/");
    let appId = null;
    if (path[0] == "") {
      console.log("path[0] empty");
    } else {
      appId = path[0];
    }
    appId = path[1];

    try {
      if (appId) {
        const application = await Application.findById(appId);
        if (!application) {
          throw createError.NotFound("application not found");
        }
        req.application = application;
        if (application.key != user_agent) {
          return next(createError(403, "unauthorized"));
        }
        next();
      } else {
        return next(createError(403, "applicationId is required"));
      }
    } catch (e) {
      console.log("error", e);
      return next(createError(500, "internal server error"));
    }
  },
  express.static(TRANSCODED_VIDEOS_FILES_PATH)
);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", indexRouter);

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
