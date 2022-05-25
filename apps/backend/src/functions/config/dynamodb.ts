import AWS from "aws-sdk";
import { WEATHER_UNKNOWN, Weather } from "./utils";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_DATA!;

const WEBCAM_TOUCHED_ID = "webcam_touched";

const WEBCAM_DEFAULt_PARAMS = {
  TableName: TABLE_NAME,
  Key: {
    id: WEBCAM_TOUCHED_ID,
  },
};

function _touch(weather?: string): Promise<Weather> {
  const touchedAt = Date.now();

  // ff weather is undefined then it should not be updated
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    ...WEBCAM_DEFAULt_PARAMS,

    UpdateExpression: "set touchedAt=:t" + (weather ? ", weather=:w" : ""),
    ExpressionAttributeValues: {
      ":t": touchedAt,
      ...(weather ? { ":w": weather } : undefined),
    },
    ReturnValues: "ALL_OLD",
  };

  // DynamoDB’s update is like Postgres’ UPSERT - will add it if's missing
  return (
    dynamoDb
      .update(params)
      .promise()
      // .then((data) => {
      //   console.dir(data);
      //   return data;
      // })
      .then(({ Attributes }) => {
        if (Attributes) return (Attributes as any).weather;
        return WEATHER_UNKNOWN;
      })
      .catch((error) => console.error(error))
  );
}

/**
 * Mark as touched now.
 * @param resetWeather whether to reset/clear the current weather
 * @returns
 */
export async function touch(resetWeather = false): Promise<void> {
  return _touch(resetWeather ? WEATHER_UNKNOWN : undefined).then();
}

/**
 * Get touched mark last date.
 * @returns
 */
export async function touched(): Promise<number> {
  return (
    dynamoDb
      .get(WEBCAM_DEFAULt_PARAMS)
      .promise()
      // .then((data) => {
      //   console.dir(data);
      //   return data;
      // })
      .then(({ Item }) => {
        if (Item) {
          return (Item as any).touchedAt;
        }
        return -1;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  );
}

/**
 * Mark as touched now.
 * @param weather the latest know weather, can be missing when service is just started and this is "first" touch
 * @returns
 */
export async function weather(weather: string): Promise<Weather> {
  return _touch(weather);
}
