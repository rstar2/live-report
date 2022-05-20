import dotenv from "dotenv-safe";

// load the required env variables from the .env file
dotenv.config({
  allowEmptyValues: false,
});

import log from "./logger";

log.info("Start webcapture service");

import "./webcapture";
