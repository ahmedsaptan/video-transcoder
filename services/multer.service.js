const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

module.exports = function multerService(mimeTypes) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, TEMP_UPLOAD_FILES);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = uuidv4();
      cb(null, file.fieldname + "_" + uniqueSuffix);
    },
  });
  return multer({
    storage,
    limits: {
      fieldNameSize: 1024 * 1024 * 10,
      fieldSize: 1024 * 1024 * 200,
    },
  });
};
