import path from "path";

import { Handler } from "aws-lambda";

import dotenv from "dotenv";

// load a .env.XXXXXXX file , so NODE_ENV is obligatory
if (!process.env.NODE_ENV) throw new Error("Not passed NODE_ENV environment variable");

dotenv.config({
  path: path.resolve(__dirname, "../../../", `.env.${process.env.NODE_ENV}`),
  debug: true,
});

import ses from "./ses";
import * as dynamodb from "./dynamodb";
import { formatWeather, MAX_NOT_TOUCHED_PERIOD, WEATHER_UNKNOWN } from "./utils";

const WEBCAM_EMAIL_SUBJECT = "Cherniovo Live Report";

export const handler: Handler = async (event, _context) => {
  //   console.dir(event);
  try {
    // when working with scheduled events like
    //  - schedule:
    //    rate: rate(1 minute)
    //    input: '{"type": "WEBCAM_CHECK"}'
    // then 1. in real AWS case the received event is a already a POJO object, same as described in input
    //      2. in "sls offline" case event is a string (JSON formatted) so it has to be JSON.parse()-ed to get a POJO

    let data;
    let type = event.type;

    if (type) {
      // 1. scheduled event in AWS case
      data = event;
    } else {
      // 2. scheduled event in "sls offline" case
      // try parse the event as if it a result of the scheduled input like '{"type": "WEBCAM_CHECK"}'
      try {
        data = JSON.parse(event);
        type = data.type;
      } catch (err) {
        // this means it is coming from an HTTP request
        data = JSON.parse(event.body);
        type = data.type;
      }
    }

    if (!data || !type) throw new Error(`Invalid event ${JSON.stringify(event)}`);

    switch (type) {
      case "WEBCAM_START_SERVICE":
        await dynamodb.touch(true);
        await ses(WEBCAM_EMAIL_SUBJECT, "Webcam restarted");
        break;

      case "WEBCAM_PING":
        await dynamodb.touch();
        break;

      case "WEBCAM_NEW_IMAGE": {
        const { weather = WEATHER_UNKNOWN } = data;

        // update latest weather and get previous value
        const oldWeather = await dynamodb.weather(weather);

        if (oldWeather != weather) {
          //   if (oldWeather === WEATHER_UNKNOWN)
          //     await ses(WEBCAM_EMAIL_SUBJECT, `Weather now is ${formatWeather(weather)}`);
          //   else {
          //     // TODO: report reasonable change weather change
          //     await ses(
          //       WEBCAM_EMAIL_SUBJECT,
          //       `Weather was ${formatWeather(oldWeather)}, now is ${formatWeather(weather)}`
          //     );
          //   }
        }

        break;
      }
      case "WEBCAM_NEW_VIDEO":
        await dynamodb.touch();
        break;

      case "WEBCAM_CHECK": {
        const report = await dynamodb.report(MAX_NOT_TOUCHED_PERIOD);
        if (report) await ses(WEBCAM_EMAIL_SUBJECT, "Webcam stopped");
        break;
      }

      default:
        throw new Error(`Unknown type event ${type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
        // event,
        // dynamodbData,
        // _context,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "An error occurred" + error,
    };
  }
};
