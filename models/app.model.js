const mongoose = require("mongoose");
const { Schema } = mongoose;

const ApplicationSchema = new Schema(
  {
    title: String,
    videosCount: {
      type: Number,
      default: 0,
    },
    key: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
