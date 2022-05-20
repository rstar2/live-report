import { Image } from "../types";

export type ImagesProps = {
  list: Image[];
};
export default function Images({ list }: ImagesProps) {
  return <>Images {list.length}</>;
}
