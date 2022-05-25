import dotenv from "dotenv-safe";

// load the required env variables from the .env file
dotenv.config({
  allowEmptyValues: false,
});

import log from "./logger";
import * as notify from "./notify";

log.info("Start webcapture service");

notify.start();

import "./webcapture";
