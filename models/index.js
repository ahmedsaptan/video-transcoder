const mongoose = require("mongoose");

//Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/video_transcoder";
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("connect to database");
  })
  .catch((e) => {
    console.log(e);
    console.log("unable to connect to database");
  });
