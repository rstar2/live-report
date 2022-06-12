export const WEATHER_UNKNOWN = "UNKNOWN";

export enum Weather {
  SUNNY = "Sunny",
  RAINY = "Rainy",
  SNOWY = "Snowy",
  FOGGY = "Foggy",
}

export type WeatherReport =
  | typeof WEATHER_UNKNOWN
  | {
      [key in keyof typeof Weather]?: number;
    };

export type Primitive = string | number | boolean;

export type Args = {
  [key: string]: Primitive;
};
