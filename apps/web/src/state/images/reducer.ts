import { useReducer } from "react";

import { sortByDate } from "utils/src";

import { ImagesState, Image } from "@/types";

const initState: ImagesState = {
  onceLoadedToday: false,
  onceLoadedYesterday: false,
  today: [],
  yesterday: [],
};
const reducer = (prevState: ImagesState, action: ImagesAction): ImagesState => {
  let keyList!: keyof ImagesState;
  let keyLoaded!: keyof ImagesState;
  switch (action.type) {
    case "LIST_TODAY":
      keyList = "today";
      keyLoaded = "onceLoadedToday";
      break;
    case "LIST_YESTERDAY":
      keyList = "yesterday";
      keyLoaded = "onceLoadedYesterday";
      break;
    default:
      throw new Error();
  }
  return {
    ...prevState,

    // keep that it's loaded at least once
    [keyLoaded]: true,

    // sort by date
    [keyList]: action.list.sort(sortByDate),
  };
};

export type ImagesAction = ImagesActionListToday | ImagesActionListYesterday;

type ImagesActionListToday = {
  type: "LIST_TODAY";
  list: Image[];
};
type ImagesActionListYesterday = {
  type: "LIST_YESTERDAY";
  list: Image[];
};

export type ImagesActionType = "LIST_TODAY" | "LIST_YESTERDAY";

export const useImagesReducer = () => {
  // NOTE: the reducer function MUST NOT be defined as inline function here,
  // otherwise it will be each time a new function, so a dispatch(...) could cause calling the reducer twice
  // More info at:
  // https://stackoverflow.com/questions/54892403/usereducer-action-dispatched-twice
  // https://stackoverflow.com/questions/55055793/react-usereducer-hook-fires-twice-how-to-pass-props-to-reducer/55056623#55056623
  return useReducer(reducer, initState);
};
