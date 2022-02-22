require("dotenv").config;
const ffmpeg = require("fluent-ffmpeg");
const createError = require("http-errors");
const { join, extname } = require("path");
const fs = require("fs-extra");
const { EXTENSIONS } = require("../constants/video.constant");
const Video = require("../models/video.model");
const Application = require("../models/app.model");
const ObjectId = require("mongoose").Types.ObjectId;
const { body } = require("express-validator");
const { checkValidations } = require("../helpers/checkMethods");
function isVideoFile(fileName) {
  for (let i = 0; i < EXTENSIONS.length; i++)
    if (fileName.includes(EXTENSIONS[i])) return true;
  return false;
}

const validateOnCreate = () => {
  return [
    body("applicationId")
      .exists()
      .withMessage("applicationId is required")
      .notEmpty()
      .withMessage("applicationId is empty")
      .isMongoId()
      .withMessage("applicationId is not valid")
      .custom(async (value, { req }) => {
        try {
          console.log("value", value);
          const existApp = await Application.findById(value);
          console.log("existApp", existApp);
          if (!existApp) {
            throw createError.NotFound("application not found");
          }
          req.existApp = existApp;
          return true;
        } catch (error) {
          throw error;
        }
      }),
  ];
};
const transcodeVideo = async (req, res, next) => {
  try {
    console.log(req.body);
    checkValidations(req);
    const appName = req.existApp._id.toString();
    const videosOutputPath = join(UPLOADED_VIDEOS_FILES_PATH, appName);
    await fs.ensureDir(videosOutputPath);

    const file = req.file;
    const ext = extname(file.originalname);
    console.log("video_file", req.file);
    if (!file) {
      throw createError.BadRequest("file not found");
    }

    if (!isVideoFile(file.originalname)) {
      throw createError.BadRequest("wrong video format");
    }

    const video = new Video({
      title: file.originalname,
      applicationId: req.existApp._id,
    });

    await video.save();
    req.existApp.videosCount = req.existApp.videosCount + 1;
    await req.existApp.save();
    res.status(201).send(video);
    const VIDEO_ID = video._id.toString();
    let inputPath = join(videosOutputPath, VIDEO_ID + ext);
    //  copy file from temp to videos folder
    await fs.copy(join(file.destination, file.filename), inputPath);

    // remove file from temp folder
    fs.remove(join(file.destination, file.filename))
      .then(() => {
        console.log("file removed");
      })
      .catch((e) => {
        console.log("error while delete file", e);
      });

    // check if transcoded folder exists
    const transcodedVideoPath = join(TRANSCODED_VIDEOS_FILES_PATH, appName);
    await fs.ensureDir(transcodedVideoPath);

    // make folder for transcoded videos for this video
    const video_transcoder_path = join(transcodedVideoPath, VIDEO_ID);
    await fs.ensureDir(video_transcoder_path);
    let outputPath360 = join(video_transcoder_path, "360.mp4");
    let outputPath480 = join(video_transcoder_path, "480.mp4");
    let outputPath720 = join(video_transcoder_path, "720.mp4");

    let appUrl;
    if (DEV) {
      appUrl = "http://localhost:3000";
    } else {
      appUrl = APP;
    }

    const urls = [
      {
        quailty: 360,
        url: `${appUrl}/uploads/transcodedVideos/${appName}/${VIDEO_ID}/360.mp4`,
      },
      {
        quailty: 480,
        url: `${appUrl}/uploads/transcodedVideos/${appName}/${VIDEO_ID}/480.mp4`,
      },
      {
        quailty: 720,
        url: `${appUrl}/uploads/transcodedVideos/${appName}/${VIDEO_ID}/720.mp4`,
      },
    ];
    console.table({
      inputPath,
      outputPath360,
      outputPath480,
      outputPath720,
    });
    console.time("transcode");
    const command = ffmpeg()
      .input(inputPath)
      .videoCodec("libx264")
      .output(outputPath720)
      .size("1080x?")
      .output(outputPath480)
      .size("768x?")
      .output(outputPath360)
      .size("320x?")
      .on("progress", function (progress) {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", async function () {
        console.timeEnd("transcode");
        console.log("Videos converted");
        video.transcoded = true;
        video.urls = urls;
        await video.save();
        fs.unlink(inputPath, async (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("file deleted");
            video.originFileDelete = true;
            await video.save();
          }
        });
      })
      .on("error", function (err) {
        console.error("this error:");
        console.error(err);
      })
      .run();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

const getVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    if (!videoId) {
      throw createError.BadRequest("videoId not found");
    }

    if (!ObjectId.isValid(videoId)) {
      throw createError.BadRequest("not valid id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
      throw createError.NotFound("video not found");
    }
    if (!video.transcoded) {
      throw createError.BadRequest("video not transcodef yet");
    }

    res.send({
      video: {
        _id: video._id,
        urls: video.urls,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const checkTranscoded = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    if (!videoId) {
      throw createError.BadRequest("videoId not found");
    }

    if (!ObjectId.isValid(videoId)) {
      throw createError.BadRequest("not valid id");
    }

    const video = await Video.findById(videoId);

    res.send({
      video: {
        _id: video._id,
        transcoded: video.transcoded,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  transcodeVideo,
  getVideo,
  checkTranscoded,
  validateOnCreate,
};
