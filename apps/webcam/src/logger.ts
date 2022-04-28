import log4js from "log4js";

const IS_DEBUG = process.env.WEBCAM_LOG_LEVEL === "debug";

log4js.configure({
  appenders: {
    console: {
      type: "console",
    },
    file: {
      // output to a file and rotate it after it reaches a max size,
      // also keep max 3 backup/old versions and compress them
      type: "file",
      filename: "logs/default.log",
      maxLogSize: 10485760, // 1 MB
      // maxLogSize: 1024,  // 1 KB
      backups: 3,
      // compress: true,
    },
  },
  categories: {
    default: {
      appenders: ["console", "file"],
      level: IS_DEBUG ? "debug" : "info",
    },
  },
});

const logger = log4js.getLogger();

export default {
  isDebug() {
    return logger.isDebugEnabled();
  },

  debug(message: string) {
    logger.debug(message);
  },

  info(message: string) {
    logger.info(message);
  },

  warn(message: string, error?: Error) {
    // add the error stacktrace if available
    if (error) logger.warn(message + ": ", error);
    else logger.warn(message);
  },
};
