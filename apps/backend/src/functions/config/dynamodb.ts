import {
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemInput,
  GetItemCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";

import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { WEATHER_UNKNOWN, WeatherReport } from "utils";

// AWS_ACCESS_KEY_ID , AWS_SECRET_ACCESS_KEY and som more are predefined by AWS Lambda environment variables
// so don't use same names
const AWS_ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const dynamoDb = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials:
    AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

const TABLE_NAME = process.env.DYNAMODB_DATA!;

const WEBCAM_TOUCHED_ID = "webcam_touched";

const WEBCAM_DEFAULT_PARAMS = {
  TableName: TABLE_NAME,
  Key: {
    id: { S: WEBCAM_TOUCHED_ID },
  },
};

function markTouched(weather?: WeatherReport): Promise<WeatherReport> {
  const touchedAt = Date.now();

  let marshalledWeather: AttributeValue | undefined;
  if (weather) {
    // cannot get it "work" with TypeScript (I think the marshall.d.ts is not correct)
    // so will disable some checks, still th result must be like:
    //   if weather is string      ->  { S: "rainy" }
    //   if weather is object-map  ->  { M: { rain: { N: "55" } } }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof weather === "string") marshalledWeather = marshall(weather);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    else marshalledWeather = { M: marshall(weather) };

    console.log("marshalled weather", marshalledWeather);
  }

  // ff weather is undefined then it should not be updated
  const params: UpdateItemInput = {
    ...WEBCAM_DEFAULT_PARAMS,

    UpdateExpression: "set touchedAt=:t, reported=:r" + (weather ? ", weather=:w" : ""),
    ExpressionAttributeValues: {
      ":t": { N: "" + touchedAt },
      ":r": { BOOL: false },
      //   ...(weather ? { ":w": { S: "weather" } } : undefined),
      //   ...(weather ? { ":w": { M: { rain: { N: "55" } } } } : undefined),
      ...(marshalledWeather ? { ":w": marshalledWeather } : undefined),
    },
    ReturnValues: "ALL_OLD",
  };

  // DynamoDB’s update is like Postgres’ UPSERT - will add it if's missing
  return (
    dynamoDb
      .send(new UpdateItemCommand(params))
      // .then((data) => {
      //   console.dir(data);
      //   return data;
      // })
      .then(({ Attributes }) => {
        if (Attributes) return unmarshall(Attributes).weather;
        return WEATHER_UNKNOWN;
      })
      .catch((error) => console.error(error))
  );
}

function markReported() {
  console.log("mark reported");
  const params: UpdateItemInput = {
    ...WEBCAM_DEFAULT_PARAMS,

    UpdateExpression: "set reported=:r",
    ExpressionAttributeValues: {
      ":r": { BOOL: true },
    },
  };

  return dynamoDb.send(new UpdateItemCommand(params)).catch((error) => console.error(error));
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
      .send(new GetItemCommand(WEBCAM_DEFAULT_PARAMS))
      // .then((data) => {
      //   console.dir(data);
      //   return data;
      // })
      .then(({ Item }) => {
        if (Item) {
          // by default it's in the form of "DynamoDB JSON",
          //  so transform it to plain JSON - this is called unmarshall
          // Example:
          //   {
          //     "id": {
          //      "S": "webcam_touched"
          //     },
          //     "reported": {
          //      "BOOL": false
          //     },
          //     "touchedAt": {
          //      "N": "1645756270072"
          //     },
          //     "weather": {
          //      "M": {
          //       "FOGGY": {
          //        "N": "33"
          //       },
          //       "SUNNY": {
          //        "N": "90"
          //       }
          //      }
          //     }
          //    }
          // So make it as plain JSON:
          //   {
          //     "id": "webcam_touched",
          //     "reported": false,
          //     "touchedAt": 1645756270072,
          //     "weather": {
          //      "FOGGY": 33,
          //      "SUNNY": 90
          //     }
          //    }
          const item = unmarshall(Item);

          console.log("check reported", item);
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
export async function weather(weather: WeatherReport): Promise<WeatherReport> {
  return markTouched(weather);
}
