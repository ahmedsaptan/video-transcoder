require("dotenv").config;
const ffmpeg = require("fluent-ffmpeg");
const createError = require("http-errors");
const { join, extname } = require("path");
const fs = require("fs-extra");
const { EXTENSIONS } = require("../constants/video.constant");

function isVideoFile(fileName) {
  for (let i = 0; i < EXTENSIONS.length; i++)
    if (fileName.includes(EXTENSIONS[i])) return true;
  return false;
}
const transcodeVideo = async (req, res, next) => {
  try {
    const appName = req.headers["app-name"];
    if (!appName) {
      throw createError.BadRequest("app-name in headers not found");
    }
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

    let inputPath = join(videosOutputPath, file.filename + ext);
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
    const video_transcoder_path = join(transcodedVideoPath, file.filename);
    await fs.ensureDir(video_transcoder_path);
    const video_id = file.filename.split("_")[1];
    let outputPath360 = join(video_transcoder_path, "360.mp4");
    let outputPath480 = join(video_transcoder_path, "480.mp4");
    let outputPath720 = join(video_transcoder_path, "720.mp4");

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
      .on("end", function () {
        console.timeEnd("transcode");
        console.log("Videos converted");
        fs.unlink(inputPath, (err) => {
          if (err) res.status(500).json({ message: err });
          else {
            res.status(201).json({
              message: "File Uploaded Successfully!!",
              video_id,
              low_quality_url: outputPath360,
              mid_quality_url: outputPath480,
              high_quality_url: outputPath720,
            });
            return;
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
    const appName = req.query["app-name"];
    if (!appName) {
      throw createError.BadRequest("appName not found");
    }

    console.table({ videoId, appName });

    const appNameFolder = join(TRANSCODED_VIDEOS_FILES_PATH, appName);

    fs.access(appNameFolder, fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        return next(createError.BadRequest("appName not found"));
      }

      const video_transcoder_path = join(appNameFolder, `video_${videoId}`);

      fs.access(video_transcoder_path, fs.F_OK, (err) => {
        if (err) {
          console.error(err);
          return next(createError.BadRequest("video not found"));
        }

        fs.readdir(video_transcoder_path, (err, files) => {
          if (err) {
            console.log(err);
            return next(createError.BadRequest("video not found"));
          }
          let appUrl;
          if (DEV) {
            appUrl = "http://localhost:5000/";
          } else {
            appUrl = " https://video-transcoder-server.herokuapp.com/";
          }
          const video_url = `${appUrl}uploads/transcodedVideos/${appName}/video_${videoId}/`;
          const videos = files.map((f) => {
            return video_url + f;
          });
          res.send({
            low_quality_url: videos[0],
            mid_quality_url: videos[1],
            high_quality_url: videos[2],
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  transcodeVideo,
  getVideo,
};
