import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import serverlessExpress from "@vendia/serverless-express";
import { Handler } from "aws-lambda";
import express from "express";
import dotenv from "dotenv";

// NOTE: this dotenv must be configured before anything else if there's usage on process.env.xxx
// in the static section of a ts file
// load a .env.XXXXXXX file , so NODE_ENV is obligatory
if (!process.env.NODE_ENV) throw new Error("Not passed NODE_ENV environment variable");
dotenv.config({
  path: join(__dirname, "../../../", `.env.${process.env.NODE_ENV}`),
  debug: true,
});

// load a special .env.offline file just when run with 'sls offline'
if (process.env.IS_OFFLINE === "true")
  dotenv.config({
    path: join(__dirname, "../../../", `.env.offline`),
    debug: true,
  });

import { AppModule } from "./server/app.module";

let cachedServer: Handler;

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by @vendia/serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
// NOTE: The APIGateway has to also configured to passthrough binary files - can be just */*.
const binaryMimeTypes = [
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "application/octet-stream",
  //   "application/javascript",
  //   "application/json",
  //   "application/xml",
  //   "text/comma-separated-values",
  //   "text/css",
  //   "text/html",
  //   "text/javascript",
  //   "text/plain",
  //   "text/text",
  //   "text/xml",
];

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    nestApp.enableCors();

    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp, binaryMimeTypes });
  }

  return cachedServer;
}

export const handler: Handler = async (event, context, callback) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
