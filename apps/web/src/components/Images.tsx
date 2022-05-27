import { Image } from "../types";

export type ImagesProps = {
  list: Image[];
  title: string;
};
export default function Images({ list, title }: ImagesProps) {
  return (
    <>
      {title}'s images {list.length}
    </>
  );
}
