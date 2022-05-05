import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import serverlessExpress from "@vendia/serverless-express";
import { Handler } from "aws-lambda";
import express from "express";

import { AppModule } from "./app.module";

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
