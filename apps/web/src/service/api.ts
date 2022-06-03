/* eslint-disable no-console */

import { Image, Video } from "@/types";
import http from "@/http";

const URL_IMAGES_LIST = import.meta.env.VITE_URL_IMAGES_LIST;
const URL_VIDEOS_LIST = import.meta.env.VITE_URL_VIDEOS_LIST;

export async function getImagesToday(): Promise<Image[]> {
  const list: [] = await http(URL_IMAGES_LIST);
  console.log("Fetched today's images", list.length);
  return [
    {
      name: "0",
      url: "https:/0",
      date: new Date(),
    },
  ];
}

export async function getImagesYesterday(): Promise<Image[]> {
  console.log("Fetch yesterday's images", URL_IMAGES_LIST);
  return [];
}

export async function getVideosToday(): Promise<Video[]> {
  console.log("Fetch today's videos", URL_VIDEOS_LIST);
  return [];
}

export async function getVideosYesterday(): Promise<Video[]> {
  console.log("Fetch yesterday's videos", URL_VIDEOS_LIST);
  return [];
}
