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

const getItemsForDate = async (dateRequired: Date, isVideo = false) => {
  const listRaw: ItemRaw[] = await http(isVideo ? URL_VIDEOS_LIST : URL_IMAGES_LIST);
 
  // TODO: temporary hack
  dateRequired.setMonth(dateRequired.getMonth() - 1);

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

export async function getImagesToday(): Promise<Image[]> {
  return getItemsForDate(getToday());
}

export async function getImagesYesterday(): Promise<Image[]> {
  return getItemsForDate(getYesterday());
}

export async function getVideosToday(): Promise<Video[]> {
  return getItemsForDate(getToday(), true);
}

export async function getVideosYesterday(): Promise<Video[]> {
  return getItemsForDate(getYesterday(), true);
}
