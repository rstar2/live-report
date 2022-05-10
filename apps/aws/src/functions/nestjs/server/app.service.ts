import { Injectable } from "@nestjs/common";

import { S3Client, ListObjectsV2Command, ListObjectsV2CommandInput } from "@aws-sdk/client-s3";

const S3 = new S3Client({ region: process.env.AWS_REGION });

console.log("Bucket: ", process.env.UPLOAD_BUCKET);
const params: ListObjectsV2CommandInput = {
  Bucket: process.env.UPLOAD_BUCKET,
  MaxKeys: 100,
  Delimiter: "/",
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
  async getVideos(folder = ""): Promise<string[]> {
    console.log("Getting videos for", folder);

    const response = await list({
      ...params,
      Prefix: ensureEndsWith(`videos/${folder}`),
    });

    return response;
  }

  async getImages(folder = "") {
    console.log("Getting images for", folder);

    const response = await list({
      ...params,
      Prefix: ensureEndsWith(`images/${folder}`),
    });

    return response;
  }
}
