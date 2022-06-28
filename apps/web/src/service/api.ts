/* eslint-disable no-console */

import { isSameDay } from "utils/src";

import { Image, Video } from "@/types";
import http from "@/http";

const URL_IMAGES_LIST = import.meta.env.VITE_URL_IMAGES_LIST;
const URL_VIDEOS_LIST = import.meta.env.VITE_URL_VIDEOS_LIST;

type ItemRaw = {
  name: string;
  url: string;
  date: number;
};

const getToday = () => new Date();
const getYesterday = () => {
  const today = getToday();
  today.setDate(today.getDate() - 1);
  return today;
};

// use a fixed date for testing when the webcam service is stopped
// const getToday = () => new Date(Date.parse("6/17/2022"));
// const getYesterday = () => new Date(Date.parse("6/17/2022"));

const getItemsForDate = async (dateRequired: Date, isVideo = false) => {
  const listRaw: ItemRaw[] = await http(isVideo ? URL_VIDEOS_LIST : URL_IMAGES_LIST);

  const list = listRaw
    .map(
      ({ name, url, date }) =>
        ({
          name,
          url,
          date: new Date(date),
        } as Image)
    )
    .filter(({ date }) => isSameDay(dateRequired, date));

  console.log(`Fetched ${list.length} ${isVideo ? "videos" : "images"} for ${dateRequired}`);
  return list;
};

export async function getImagesToday(): Promise<{ list: Image[]; date: Date }> {
  const date = getToday();
  return { list: await getItemsForDate(date), date };
}

export async function getImagesYesterday(): Promise<{ list: Image[]; date: Date }> {
  const date = getYesterday();
  return { list: await getItemsForDate(date), date };
}

export async function getVideosToday(): Promise<{ list: Video[]; date: Date }> {
  const date = getToday();
  return { list: await getItemsForDate(date, true), date };
}

export async function getVideosYesterday(): Promise<{ list: Video[]; date: Date }> {
  const date = getYesterday();
  return { list: await getItemsForDate(date, true), date };
}
