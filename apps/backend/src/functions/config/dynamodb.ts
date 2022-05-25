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

function markTouched(weather?: string): Promise<Weather> {
  const touchedAt = Date.now();

  // ff weather is undefined then it should not be updated
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    ...WEBCAM_DEFAULt_PARAMS,

    UpdateExpression: "set touchedAt=:t, reported=:r" + (weather ? ", weather=:w" : ""),
    ExpressionAttributeValues: {
      ":t": touchedAt,
      ":r": false,
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

function markReported() {
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    ...WEBCAM_DEFAULt_PARAMS,

    UpdateExpression: "set reported=:r",
    ExpressionAttributeValues: {
      ":r": true,
    },
  };

  return dynamoDb
    .update(params)
    .promise()
    .catch((error) => console.error(error));
}

/**
 * Mark as touched now.
 * @param resetWeather whether to reset/clear the current weather
 * @returns
 */
export async function touch(resetWeather = false): Promise<void> {
  return markTouched(resetWeather ? WEATHER_UNKNOWN : undefined).then();
}

/**
 * Check whether touched mark last date whether has been before a specific period,
 * and if yes return
 * @returns
 */
export async function report(period: number): Promise<boolean> {
  // TODO: this double access to DynamoDB (get touched time and then mark reported)
  // can be done in a single call with conditional expressions
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
          const item = Item as any;

          if (!item.reported && Date.now() - item.touchedAt > period) {
            return markReported().then(() => true);
          }
        }
        return false;
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
  return markTouched(weather);
}
