export const WEATHER_UNKNOWN = "UNKNOWN";

export type Weather = typeof WEATHER_UNKNOWN | Record<string, number>;

export function formatWeather(weather: Weather): string {
  if (weather === WEATHER_UNKNOWN) return weather;

  return JSON.stringify(weather);
}
