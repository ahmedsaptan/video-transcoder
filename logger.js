const winston = require("winston");

const options = {
  file: {
    level: "info",
    filename: "./logs/logs.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
  },
};

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [new winston.transports.File(options.file)],
  format: winston.format.json(),
  exitOnError: false,
});

module.exports = logger;
