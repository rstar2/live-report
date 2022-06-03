import { Image } from "@/types";

import { Grid } from "@mantine/core";

export type ImagesProps = {
  list: Image[];
};
export default function Images({ list }: ImagesProps) {
  return <Grid>{list.length}</Grid>;
}
