const fs = require("fs");

const checkUploadesFolders = () => {
  if (!fs.existsSync(UPLOADED_VIDEOS_FILES_PATH)) {
    fs.mkdirSync(UPLOADED_VIDEOS_FILES_PATH);
    console.log(`${UPLOADED_VIDEOS_FILES_PATH} CREATED!!`);
  } else {
    console.log(`${UPLOADED_VIDEOS_FILES_PATH} ALREADY EXIST!!`);
  }
  if (!fs.existsSync(TRANSCODED_VIDEOS_FILES_PATH)) {
    fs.mkdirSync(TRANSCODED_VIDEOS_FILES_PATH);
    console.log(`${TRANSCODED_VIDEOS_FILES_PATH} CREATED!!`);
  } else {
    console.log(`${TRANSCODED_VIDEOS_FILES_PATH} ALREADY EXIST!!`);
  }
};
module.exports = {
  checkUploadesFolders,
};
