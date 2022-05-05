import dotenv from "dotenv-safe";

import log from "./logger";

// load the required env variables from the .env file
dotenv.config({
  // allows env to be empty, still they HAVE to be defined in .env like "var="
  allowEmptyValues: true,
});

log.info(process.env.URL_UPLOAD_IMAGE ?? "");
log.info(process.env.URL_UPLOAD_VIDEO ?? "");
