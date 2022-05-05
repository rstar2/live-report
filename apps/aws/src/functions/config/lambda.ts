import path from "path";

import { Handler } from "aws-lambda";

import dotenv from "dotenv";

// load a .env.XXXXXXX file only if no NODE_ENV specified
console.log(process.env.NODE_ENV + "   " + process.env.NODE_ENV2);
if (process.env.NODE_ENV) {
  dotenv.config({
    path: path.resolve(__dirname, "../../", `.env.${process.env.NODE_ENV}`),
  });
}

import lodash from "lodash";

export const handler: Handler = async (_event, _context) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Success image! - ${lodash.add(4, 5)} - ${process.env.SECRET}`,
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
