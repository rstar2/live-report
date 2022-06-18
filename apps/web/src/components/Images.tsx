import { Image as Img } from "@mantine/core";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import { Image } from "@/types";
// import useBreakpoints from "@/hooks/useBreakpoints";

export type ImagesProps = {
  list: Image[];
};
export default function Images({ list }: ImagesProps) {
  //   const { xsAndUp, mdAndUp, lgAndUp } = useBreakpoints();

  const items = list.map((image) => <ImageItem image={image} />);
  return (
    <>
      {/* <Box>Is xs : {"" + xsAndUp}</Box>
      <Box>Is md : {"" + mdAndUp}</Box>
      <Box>Is lg : {"" + lgAndUp}</Box> */}
      <AliceCarousel mouseTracking items={items} />
    </>
  );
}

function ImageItem({ image }: { image: Image }) {
  return (
    //   <Box sx={{ width: 640 }} mx="auto">
    <Img
      radius="md"
      src={image.url}
      alt={image.name}
      title={image.name}
      caption={image.date.toLocaleString()}
      withPlaceholder
    />
    //   </Box>
  );
}
