const fs = require("fs-extra");

const checkUploadesFolders = async () => {
  console.log(UPLOADED_VIDEOS_FILES_PATH);
  console.log(TRANSCODED_VIDEOS_FILES_PATH);
  console.log(TEMP_UPLOAD_FILES);
  await fs.ensureDir(UPLOADED_VIDEOS_FILES_PATH);
  await fs.ensureDir(TRANSCODED_VIDEOS_FILES_PATH);
  await fs.ensureDir(TEMP_UPLOAD_FILES);
  console.log("end checkUploadesFolders");
};
module.exports = {
  checkUploadesFolders,
};
