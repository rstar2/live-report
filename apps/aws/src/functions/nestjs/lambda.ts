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

import { AppModule } from "./server/app.module";

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    nestApp.enableCors();

    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler: Handler = async (event, context, callback) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
