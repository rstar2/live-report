import path from "path";
import fs from "fs/promises";
import child_process from "child_process";
import bent from "bent";

import cron from "node-cron";

import log from "./logger";
import { createNameForNow, formatString, formatTags } from "./format";

// these are protected by dotenv-safe
const REST_URL_UPLOAD_IMAGE = process.env.REST_URL_UPLOAD_IMAGE!;
const REST_URL_TAG_IMAGE = process.env.REST_URL_TAG_IMAGE!;

const IMAGE_CAPTURE_CRON = "* * * * *"; // every minute - for testing only
// const IMAGE_CAPTURE_CRON = "0 7-19 * * *"; // every 1 hour from 7 to 19

const put = bent("PUT");

// schedule a image capture
cron.schedule(IMAGE_CAPTURE_CRON, task);

// reuse same image
const IMAGE_NAME = "image.jpg";

/**
 * The cron task - the main "worker".
 */
async function task() {
  try {
    // take/capture a new image
    const imagePath = await captureImage(IMAGE_NAME);

    // read the file as data
    const imageBuffer = await readImage(imagePath);

    const imageName = createNameForNow() + ".jpg";

    // upload it to AWS
    await uploadImage(imageName, imageBuffer, REST_URL_UPLOAD_IMAGE);

    // tag it as "snapshot" - this has to be done after some timeout in order to allow S# to create the "resource"
    // otherwise executing it immediately after creation has no effect

    setTimeout(() => {
      tagImage(imageName, ["snapshot"], REST_URL_TAG_IMAGE);
    }, 5000);
  } catch (error: unknown) {
    log.warn(`Failed with ${error}`);
  }
}

/**
 * Capture and save an image with the webcam and save it wi
 * @param imageName the name of the saved image file
 * @return the absolute path of the saved image file
 */
async function captureImage(imageName: string) {
  // capture and write a file
  if (log.isDebug()) log.debug(`Start image capture ${imageName} on ${new Date()}`);

  const output = child_process.spawnSync(path.resolve(__dirname, "webcapture.sh"), [imageName], {
    encoding: "utf-8",
  });

  if (log.isDebug())
    log.debug(`Finish image capture ${imageName} on ${new Date()}
Output:
${output.stderr}`);

  return path.resolve(process.cwd(), imageName);
}

/**
 * Read and load file as {@link Buffer}
 * @param filePath the file path to the file to read
 * @return the file's data
 */
async function readImage(imagePath: string): Promise<Buffer> {
  if (log.isDebug()) log.debug(`Read image file ${imagePath}`);
  return fs.readFile(imagePath, {});
}

/**
 * Read and load file as {@link Buffer}
 * @param filePath the file path to the file to read
 * @return the file's data
 */
async function uploadImage(name: string, data: Buffer, uploadPutUrl: string) {
  uploadPutUrl = formatString(uploadPutUrl, { name });

  if (log.isDebug()) log.debug(`Upload image ${name} to ${uploadPutUrl}`);

  put(uploadPutUrl, data, {
    "Content-Type": "image/jpeg",
  });
}

/**
 * Read and load file as {@link Buffer}
 * @param filePath the file path to the file to read
 * @return the file's data
 */
async function tagImage(name: string, tags: string[], tagPutUrl: string) {
  tagPutUrl = formatString(tagPutUrl, { name });

  const data = formatTags(tags);
  if (log.isDebug()) log.debug(`Tag image ${name} with ${tags.join()} to ${tagPutUrl}`);

  await put(tagPutUrl, data, {
    "Content-Type": "text/plain",
  });
}
