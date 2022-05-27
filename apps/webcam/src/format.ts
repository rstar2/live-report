import { WeatherReport } from "./utils";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - there's no @types/stringinject
import stringInject from "stringinject";

export function createNameForNow() {
  return createNameForDate(new Date());
}

export function createNameForDate(date: Date) {
  return [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]
    .map((num) => (num < 10 ? "0" + num : num))
    .join("_");
}

type Primitive = string | number | boolean;

type Args = {
  [key: string]: Primitive;
};

export function formatString(placeholder: string, args: Args): string {
  return stringInject(placeholder, args);
}

export function formatTags(tags: Map<string, string>): string {
  const data = `<Tagging>
<TagSet>
    ${[...tags.entries()]
      .map(
        ([key, value]) =>
          `<Tag>
            <Key>${key}</Key>
            <Value>${value}</Value>
        </Tag>`
      )
      .join("\n")}
   
</TagSet>
</Tagging>`;

  return data;
}