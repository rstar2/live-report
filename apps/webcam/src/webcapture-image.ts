import path from "node:path";
import fs from "node:fs/promises";
import child_process from "node:child_process";

import { createNameForNow } from "utils";

import log from "./logger";

/**
 * Capture and save an image with the webcam
 * @param imageName the name of the saved image file
 * @return the absolute path of the saved image file
 */
async function captureImage(imageName: string) {
  // capture and write to a file
  if (log.isDebug()) log.debug(`Start image capture ${imageName} on ${new Date()}`);

  const output = child_process.execFileSync(
    path.resolve(__dirname, "webcapture-image.sh"),
    [imageName],
    {
      encoding: "utf-8",
    },
  );

  if (log.isDebug())
    log.debug(`Finish image capture ${imageName} on ${new Date()}
Output:
${output}`);

  const imagePath = path.resolve(process.cwd(), imageName);
  await fs.access(imagePath);
  return imagePath;
}

(async () => {
  const imageName = `test_${createNameForNow()}.jpg`;
  try {
    const imagePath = await captureImage(imageName);

    await fs.unlink(imagePath);
    await fs.appendFile(path.resolve(process.cwd(), "result.txt"), imageName);
  } catch (e) {
    log.warn(`Failed image capture ${imageName}`, e as Error);
  }
})();
