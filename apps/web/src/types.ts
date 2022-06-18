export type Item = {
  name: string;
  url: string;
  date: Date;
  tags?: string[];
};

export type Image = Item;
export type Video = Item;

type ItemsState<T extends Item> = {
  onceLoadedToday: boolean;
  today: T[];
  dateToday: Date;

  onceLoadedYesterday: boolean;
  yesterday: T[];
  dateYesterday: Date;
};

export type ImagesState = ItemsState<Image>;
export type VideosState = ItemsState<Video>;

type ItemContextValue<T extends ImagesState> = {
  state: T;
  refreshToday: AsyncFunction<void, void>;
  refreshYesterday: AsyncFunction<void, void>;
};
export type ImagesContextValue = ItemContextValue<ImagesState>;
export type VideosContextValue = ItemContextValue<VideosState>;

// eslint-disable-next-line no-unused-vars
export type AsyncFunction<A, O> = (arg: A) => Promise<O>;
