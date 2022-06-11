import { useReducer } from "react";

import { sortByDate } from "utils";

import { VideosState, Video } from "@/types";

const initState: VideosState = {
  today: [],
  yesterday: [],
};
const reducer = (prevState: VideosState, action: VideosAction): VideosState => {
  let key!: keyof VideosState;
  switch (action.type) {
    case "LIST_TODAY":
      key = "today";
      break;
    case "LIST_YESTERDAY":
      key = "yesterday";
      break;
    default:
      throw new Error();
  }
  return {
    ...prevState,
    // sort by date
    [key]: action.list.sort(sortByDate),
  };
};

export type VideosAction = VideosActionListToday | VideosActionListYesterday;

// TODO: could be somehow extracted by TS from VideosActionListToday andVideosActionListYesterday type key
export type VideosActionType = "LIST_TODAY" | "LIST_YESTERDAY";

type VideosActionListToday = {
  type: "LIST_TODAY";
  list: Video[];
};
type VideosActionListYesterday = {
  type: "LIST_YESTERDAY";
  list: Video[];
};

export const useVideosReducer = () => {
  // NOTE: the reducer function MUST NOT be defined as inline function here,
  // otherwise it will be each time a new function, so a dispatch(...) could cause calling the reducer twice
  // More info at:
  // https://stackoverflow.com/questions/54892403/usereducer-action-dispatched-twice
  // https://stackoverflow.com/questions/55055793/react-usereducer-hook-fires-twice-how-to-pass-props-to-reducer/55056623#55056623
  return useReducer(reducer, initState);
};
