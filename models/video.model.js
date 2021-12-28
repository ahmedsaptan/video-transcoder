const mongoose = require("mongoose");
const { Schema } = mongoose;

const VideoSchema = new Schema(
  {
    title: String,
    transcoded: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    urls: [
      {
        quailty: String,
        url: String,
      },
    ],
    originFileDelete: {
      type: Boolean,
      default: false,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", VideoSchema);
module.exports = Video;
