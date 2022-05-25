enum Weather {
  UNKNOWN = "Unknown",
  SUNNY = "Sunny",
  RAINY = "Rainy",
  SNOWY = "Snowy",
  FOGGY = "Foggy",
}

export type WeatherReport = {
  [key in keyof typeof Weather]?: number;
};

/**
 * Analyze the image data and predict a result
 * @param data
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (data: Buffer): WeatherReport {
  // TODO: Analyze image and notify if it's rain/snow/heat
  return { SUNNY: 90, FOGGY: 33 };
}
