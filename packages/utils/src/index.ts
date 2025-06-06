import stringInject from "./string-inject";

export * from "./types";

import { WeatherReport, WEATHER_UNKNOWN } from "./types";

// the max period the function is not touched and it would mean then that there's no electricity
// technically it could be result from a lot of reasons (no electricity, no internet, hardware problem, software problem)
export const MAX_NOT_TOUCHED_PERIOD = Number.parseInt(
  process.env.MAX_NOT_TOUCHED_PERIOD || "" + 30 * 60 * 1000,
); // 30 mins by default

export function formatWeather(weather: WeatherReport): string {
  if (weather === WEATHER_UNKNOWN) return weather as string;

  return JSON.stringify(weather);
}

export function noop(): void {
  //
}

type HasDate = {
  date: Date;
};

export function sortByDate(a: HasDate, b: HasDate): 0 | -1 | 1 {
  const aDate = a.date.getTime();
  const bDate = b.date.getTime();
  if (aDate === bDate) return 0;
  return aDate < bDate ? -1 : 1;
}

export function isSameDay(dateFixed: Date, dateToCheck: Date) {
  return (
    dateFixed.getFullYear() === dateToCheck.getFullYear() &&
    dateFixed.getMonth() === dateToCheck.getMonth() &&
    dateFixed.getDate() === dateToCheck.getDate()
  );
}

export function createNameForNow() {
  return createNameForDate(new Date());
}

export function createNameForDate(date: Date) {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ]
    .map((num) => (num < 10 ? "0" + num : num))
    .join("_");
}

export function formatString(
  placeholder: string,
  args: string[] | Record<string, string>,
): string {
  return stringInject(placeholder, args);
}
