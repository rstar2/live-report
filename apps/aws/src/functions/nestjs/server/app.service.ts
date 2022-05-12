import { Injectable } from "@nestjs/common";

import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from "@aws-sdk/client-s3";

const S3 = new S3Client({ region: process.env.AWS_REGION });

console.log("Bucket: ", process.env.UPLOAD_BUCKET);
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

const list = async (params: ListObjectsV2CommandInput, accum: string[] = []): Promise<string[]> => {
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

@Injectable()
export class AppService {
  async list(isImage: boolean, folder = "") {
    console.log(`Getting ${isImage ? "images" : "videos"} for ${folder}`);

    const response = await list({
      ...paramsList,
      Prefix: ensureEndsWith(`${isImage ? "images" : "videos"}/${folder}`),
    });

    return response;
  }

  async download(key: string, isImage: boolean) {
    const response = await S3.send(
      new GetObjectCommand({
        ...paramsGet,
        Key: `${isImage ? "images" : "videos"}/${key}`,
      })
    );
    return response.Body!;
  }
}
