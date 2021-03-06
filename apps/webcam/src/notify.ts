import bent, { NodeResponse, StatusError } from "bent";
import { WeatherReport } from "utils";

import log from "./logger";

const URL_CONFIG = process.env.URL_CONFIG!;

const post = bent(URL_CONFIG, "POST");

async function notify(type: string, data?: Record<string, unknown>) {
  if (log.isDebug()) log.debug(`Notify with ${type}`);

  data = {
    ...data,
    date: Date.now(),
    type,
  };
  /* const response = await  */ post("", data).catch(async (error: StatusError) => {
    const msg = await error.text();
    log.warn(`Failed to notify with ${type}`, new Error(msg));
  });
  //   if (response) {
  //     console.log(await (response as NodeResponse).json());
  //   }
}

export async function ping() {
  notify("WEBCAM_PING");
}

export async function start() {
  notify("WEBCAM_START_SERVICE");
}

export async function newImage(name: string, weatherReport: WeatherReport) {
  notify("WEBCAM_NEW_IMAGE", {
    name,
    weather: weatherReport,
  });
}

export async function newVideo(name: string) {
  notify("WEBCAM_NEW_VIDEO", {
    date: Date.now(),
    name,
  });
}
