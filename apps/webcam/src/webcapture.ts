import path from "path";
import fs from "fs/promises";
import child_process from "child_process";
import bent from "bent";

import cron from "node-cron";

import log from "./logger";
import * as notify from "./notify";
import analyze from "./analyze";
import { WeatherReport } from "./utils";
import { createNameForNow, formatString, formatTags } from "./format";
import { toThumb } from "./thumb";

const putData = bent("PUT");

const SIMPLE_NOTIFY_CRON = "*/10 * * * *";
if (log.isDebug()) log.debug(`Schedule notifying task for ${SIMPLE_NOTIFY_CRON}`);
cron.schedule(SIMPLE_NOTIFY_CRON, () => {
  notify.ping();
});

// implement image capturing
// const IMAGE_CAPTURE_CRON = "* * * * *"; // every minute - for testing only
const IMAGE_CAPTURE_CRON = "0,30 7-19 * * *"; // every 1 hour from 7 to 19
// reuse same image
const IMAGE_NAME = "image.jpg";
// these are protected by dotenv-safe
const URL_UPLOAD_IMAGE = process.env.URL_UPLOAD_IMAGE!;
const URL_TAG_IMAGE = process.env.URL_TAG_IMAGE!;

// schedule image capturing
if (log.isDebug()) log.debug(`Schedule image capturing task for ${IMAGE_CAPTURE_CRON}`);
cron.schedule(IMAGE_CAPTURE_CRON, taskImage);

// implement video capturing
// const VIDEO_CAPTURE_CRON = "* * * * *"; // every minute - for testing only
const VIDEO_CAPTURE_CRON = "15 7,11,15,19 * * *"; // every 7,11,15,19 hours
const VIDEO_NAME = "video.mp4";
// these are protected by dotenv-safe
const URL_UPLOAD_VIDEO = process.env.URL_UPLOAD_VIDEO!;
const URL_TAG_VIDEO = process.env.URL_TAG_VIDEO!;
const VIDEO_DURATION = process.env.VIDEO_DURATION || undefined;

// schedule image capturing
if (log.isDebug()) log.debug(`Schedule video capturing task for ${VIDEO_CAPTURE_CRON}`);
cron.schedule(VIDEO_CAPTURE_CRON, taskVideo);

/**
 * The cron task - the main "worker".
 */
async function taskImage() {
  try {
    // take/capture a new image
    const imagePath = await captureImage(IMAGE_NAME);

    // read the file as data
    const imageBuffer = await read(imagePath);

    const imageName = createNameForNow() + ".jpg";

    // upload it to AWS
    await upload(imageName, imageBuffer, URL_UPLOAD_IMAGE, false);

    // analyze
    const weatherReport = await analyze(imageBuffer);

    // notify
    notify.newImage(imageName, weatherReport);

    // tag it as snapshot and with analyzed weather
    tag(imageName, URL_TAG_IMAGE, weatherReport);

    thumb(imageName, imageBuffer);
  } catch (error: unknown) {
    log.warn(`Failed image capture with ${error}`);
  }
}

/**
 * Capture and save an image with the webcam
 * @param imageName the name of the saved image file
 * @return the absolute path of the saved image file
 */
async function captureImage(imageName: string) {
  // capture and write to a file
  if (log.isDebug()) log.debug(`Start image capture ${imageName} on ${new Date()}`);

  const output = child_process.spawnSync(
    path.resolve(__dirname, "webcapture-image.sh"),
    [imageName],
    {
      encoding: "utf-8",
    }
  );

  if (log.isDebug())
    log.debug(`Finish image capture ${imageName} on ${new Date()}
Output:
${output.stderr}`);

  return path.resolve(process.cwd(), imageName);
}

/**
 * Read and load file as {@link Buffer}
 * @param path the file path to the file to read
 * @return the file's data
 */
async function read(path: string): Promise<Buffer> {
  if (log.isDebug()) log.debug(`Read file ${path}`);
  return fs.readFile(path);
}

/**
 * Read and load file as {@link Buffer}
 * @param filePath the file path to the file to read
 * @return the file's data
 */
async function upload(name: string, data: Buffer, uploadPutUrl: string, isVideo: boolean) {
  uploadPutUrl = formatString(uploadPutUrl, { name });

  if (log.isDebug()) log.debug(`Upload ${isVideo ? "video" : "image"} ${name} to ${uploadPutUrl}`);

  putData(uploadPutUrl, data, {
    "Content-Type": isVideo ? "video/mpeg" : "image/jpeg",
  });
}

/**
 * Tag a image/video file
 * @param name the name of the file
 */
async function tag(
  name: string,
  tagPutUrl: string,
  weatherReport?: WeatherReport,
  isThumb = false
) {
  tagPutUrl = formatString(tagPutUrl, { name });

  const tags = new Map<string, string>([["snapshot", ""]]);
  if (isThumb) tags.set("thumb", "");
  if (weatherReport) {
    for (const weather in weatherReport) {
      tags.set(weather, "" + weatherReport[weather as keyof WeatherReport]);
    }
  }

  const data = formatTags(tags);
  if (log.isDebug()) log.debug(`Tag ${name} with ${[...tags.keys()].join()} to ${tagPutUrl}`);

  // tag it as "snapshot" - this has to be done after some timeout in order to allow S3 to create the "resource"
  // otherwise executing it immediately after creation has no effect
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      putData(tagPutUrl, data, {
        "Content-Type": "text/plain",
      })
        .then(resolve)
        .catch(reject);
    }, 5000);
  });
}

/**
 * Create an upload thumb image
 * @param imageName
 * @param imageBuffer
 */
async function thumb(imageName: string, imageBuffer: Buffer) {
  const thumbName = imageName.replace(".jpg", "-thumb.jpg");
  const thumb = await toThumb(imageBuffer);
  await upload(thumbName, thumb, URL_UPLOAD_IMAGE, false);

  tag(thumbName, URL_TAG_IMAGE, undefined, true);
}

/**
 * The cron task - the main "worker".
 */
async function taskVideo() {
  try {
    const videoPath = await captureVideo(VIDEO_NAME, VIDEO_DURATION);
    // read the file as data
    const videoBuffer = await read(videoPath);

    const videoName = createNameForNow() + ".mp4";

    // notify
    notify.newVideo(videoName);

    // upload it to AWS
    await upload(videoName, videoBuffer, URL_UPLOAD_VIDEO, true);

    // tag it as snapshot
    tag(videoName, URL_TAG_VIDEO);
  } catch (error) {
    log.warn(`Failed video capture with ${error}`);
  }
}

/**
 * Capture and save a video with the webcam
 * @param videoName the name of the saved video file
 * @param duration duration of the video
 * @return the absolute path of the saved video file
 */
async function captureVideo(videoName: string, duration?: string | number) {
  // capture and write to a file
  if (log.isDebug()) log.debug(`Start video capture ${videoName} on ${new Date()}`);

  const args = [videoName];
  if (duration) args.push("" + duration);
  const output = child_process.spawnSync(path.resolve(__dirname, "webcapture-video.sh"), args, {
    encoding: "utf-8",
  });

  if (log.isDebug())
    log.debug(`Finish video capture ${videoName} on ${new Date()}
  Output:
  ${output.stderr}`);

  return path.resolve(process.cwd(), videoName);
}
