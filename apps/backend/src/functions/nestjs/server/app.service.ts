import { Injectable } from "@nestjs/common";

import { formatString } from "utils";

import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  GetObjectTaggingCommand,
} from "@aws-sdk/client-s3";

// AWS_ACCESS_KEY_ID , AWS_SECRET_ACCESS_KEY and som more are predefined by AWS Lambda environment variables
// so don't use same names
const AWS_ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const S3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials:
    AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

// UPLOAD_BUCKET_DIRECT_GET_URL is obligatory env-variable (protected by dotenv-safe)
const UPLOAD_BUCKET_DIRECT_GET_URL = process.env.UPLOAD_BUCKET_DIRECT_GET_URL!;
// https://xxxxxx/{name}

const paramsList: ListObjectsV2CommandInput = {
  Bucket: process.env.UPLOAD_BUCKET,
  MaxKeys: 100,
  Delimiter: "/",
};

const paramsGet: GetObjectCommandInput = {
  Bucket: process.env.UPLOAD_BUCKET,
  Key: undefined,
};

const ensureEndsWith = (str: string, end = "/"): string => {
  return str.endsWith(end) ? str : `${str}${end}`;
};

const list = async (
  params: ListObjectsV2CommandInput,
  accum: string[] = [],
): Promise<string[]> => {
  return await S3.send(new ListObjectsV2Command(params)).then((data) => {
    console.log(data);
    if (data.Contents) {
      accum.push(...data.Contents.map((i: any) => i.Key));
    }

    if (data.NextContinuationToken) {
      console.log("Next continuation");
      return list({ ...params, ContinuationToken: data.NextContinuationToken }, accum);
    }

    console.log("Finished", accum.length);
    return accum;
  });
};

/**
 * Get/parse the date (as number) from the passed image/video name
 * Example: name=2022_04_25_23_30.jpg
 * @param name the image/video name
 * @param offset the offset from UTC , can be negative
 */
const parseDate = (name: string, offset: number): number => {
  name = name.replace(/\.(.+)$/, "");
  const parts = name.split("_").map((str) => +str);
  const date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
  return date.getTime() + offset;
};

@Injectable()
export class AppService {
  async list(isImage: boolean, folder = "") {
    console.log(`Getting ${isImage ? "images" : "videos"} for ${folder}`);

    let response = await list({
      ...paramsList,
      Prefix: ensureEndsWith(`${isImage ? "images" : "videos"}/${folder}`),
    });

    // response is like:
    // [
    //    "images/2022_04_25_23_30.jpg",
    //    "images/2022_04_25_23_31.jpg",
    //    "images/2022_04_26_13_00.jpg"
    // ]
    // so strip the starting "images/" or "videos/" prefix,

    if (isImage) response = response.filter((key) => !key.endsWith("-thumb.jpg"));

    // the date in the name is in local time of the webcam service which is EET, which is UTC+3, so 3 hours offset
    const hourOffset = 3 * 60 * 60 * 1000;

    return response
      .map((key) => key.substring((isImage ? "images/" : "videos/").length))
      .map((name) => ({
        name,
        date: parseDate(name, -hourOffset),
        url: formatString(UPLOAD_BUCKET_DIRECT_GET_URL, { name }),
      }));
  }

  async download(key: string, isImage: boolean) {
    const Key = `${isImage ? "images" : "videos"}/${key}`;
    console.log("Download:", key);
    const response = await S3.send(
      new GetObjectCommand({
        ...paramsGet,
        Key,
      }),
    );
    return response.Body!;
  }

  async info(key: string, isImage: boolean) {
    // NOTE: the key must not have the starting "images/" or "video/" prefix
    const Key = `${isImage ? "images" : "videos"}/${key}`;
    console.log("Get tags for key:", key);

    const response = await S3.send(
      new GetObjectTaggingCommand({
        ...paramsGet,
        Key,
      }),
    );
    if (!response.TagSet) return {};

    return response.TagSet.reduce(
      (res, { Key, Value }) => {
        res[Key!] = Value ?? "";
        return res;
      },
      {} as Record<string, string>,
    );
  }
}
