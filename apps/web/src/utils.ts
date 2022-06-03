import { Item } from "@/types";

export function noop(): void {
  //
}

export function sortByDate(a: Item, b: Item): 0 | -1 | 1 {
  const aDate = a.date.getTime();
  const bDate = b.date.getTime();
  if (aDate === bDate) return 0;
  return aDate < bDate ? -1 : 1;
}
