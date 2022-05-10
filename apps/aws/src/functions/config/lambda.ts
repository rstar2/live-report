import path from "path";

import { Handler } from "aws-lambda";

import dotenv from "dotenv";
import lodash from "lodash";

// load a .env.XXXXXXX file , so NODE_ENV is obligatory
if (!process.env.NODE_ENV) throw new Error("Not passed NODE_ENV environment variable");

dotenv.config({
  path: path.resolve(__dirname, "../../../", `.env.${process.env.NODE_ENV}`),
  debug: true,
});

export const handler: Handler = async (_event, _context) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Success image! - ${lodash.add(4, 5)} - ${process.env.UPLOAD_BUCKET}`,
        // _context,
        // _event,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "An error occurred",
    };
  }
};
