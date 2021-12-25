// require("dotenv").config;
// const ffmpeg = require("fluent-ffmpeg");
// const express = require("express");
// const spawn = require("child_process").spawn;

// const router = express.Router();

// const path = require("path");
// const { v4: uuidv4 } = require("uuid");
// const fs = require("fs");
// const fsp = fs.promises;
// const logger = require("../httpLogger");
// const jwt = require("jsonwebtoken");

const transcodeVideo = async (req, res, next) => {
  //   try {
  //     const appName = "TESTY";
  //     const videosOutputPath = VIDEOS_OUTPUT_MAIN_DIR + appName + "//";
  //     if (!fs.existsSync(videosOutputPath)) {
  //       fs.mkdirSync(videosOutputPath);
  //     }
  //     if (!req.files || !req.files.file) {
  //       res.status(400).json({
  //         message:
  //           'No Video Selected! Make sure you added the value "file" to the input attr "name"',
  //       });
  //       return;
  //     }
  //     const file = req.files.file;
  //     if (!isVideoFile(file.name)) {
  //       res.status(400).json({ message: "Invalid Video Format!" });
  //       return;
  //     }
  //     if (file.size > 131072000) {
  //       res.status(400).json({ message: "Video size is bigger than 125MB!" });
  //       return;
  //     }
  //     let lastDotIdx = file.name.lastIndexOf(".");
  //     const extension = file.name.substr(lastDotIdx);
  //     const videoId = uuidv4();
  //     const videoPath = VIDEOS_SRC_DIR + videoId + extension;
  //     const videoFullPathWithoutEx = `${BASE_URL}/media/${appName}/${videoId}`;
  //     await file.mv(videoPath, async (err) => {
  //       if (err) {
  //         res.status(500).json({ message: err });
  //         return;
  //       }
  //     });
  //     const path = require("path");
  //     const rootPath = path.dirname(require.main.filename);
  //     const uploadsPath = path.join(rootPath, "uploads");
  //     console.log(uploadsPath);
  //     let outputPath360 = path.join(uploadsPath, "360");
  //     let outputPath480 = path.join(uploadsPath, "480");
  //     let outputPath720 = path.join(uploadsPath, "720");
  //     const command = ffmpeg()
  //       .input(videoPath)
  //       .videoCodec("libx264")
  //       .output(outputPath720 + file.name)
  //       .size("1080x?")
  //       .output(outputPath480 + file.name)
  //       .size("768x?")
  //       .output(outputPath360 + file.name)
  //       .size("320x?")
  //       .on("progress", function (progress) {
  //         console.log("Processing: " + progress.percent + "% done");
  //       })
  //       .on("end", function () {
  //         console.log("Videos converted");
  //         fs.unlink(videoPath, (err) => {
  //           if (err) res.status(500).json({ message: err });
  //           else {
  //             res.status(201).json({
  //               message: "File Uploaded Successfully!!",
  //               video_id: videoId,
  //               low_quality_url: `${videoFullPathWithoutEx}_low${extension}`,
  //               mid_quality_url: `${videoFullPathWithoutEx}_mid${extension}`,
  //               high_quality_url: `${videoFullPathWithoutEx}_high${extension}`,
  //             });
  //             return;
  //           }
  //         });
  //       })
  //       .on("error", function (err) {
  //         console.error("this error:");
  //         console.error(err);
  //       })
  //       .run();
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: err });
  //   }
};

module.exports = {
  transcodeVideo,
};
