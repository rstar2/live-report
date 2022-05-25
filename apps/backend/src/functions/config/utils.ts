export const WEATHER_UNKNOWN = "UNKNOWN";

export type Weather = typeof WEATHER_UNKNOWN | Record<string, number>;

// the max period the function is not touched and it would mean then that there's no electricity
// technically it could be result from a lot of reasons (no electricity, no internet, hardware problem, software problem)
export const MAX_NOT_TOUCHED_PERIOD = Number.parseInt(
  process.env.MAX_NOT_TOUCHED_PERIOD ?? "" + 30 * 60 * 1000
); // 30 mins by default

export function formatWeather(weather: Weather): string {
  if (weather === WEATHER_UNKNOWN) return weather;

  return JSON.stringify(weather);
}
