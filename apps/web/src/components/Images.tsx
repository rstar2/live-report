import { Box, Image as Img, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import { Image } from "@/types";

export type ImagesProps = {
  list: Image[];
};
export default function Images({ list }: ImagesProps) {
  const theme = useMantineTheme();
  const largeScreen =   useMediaQuery(`(min-width: ${theme.breakpoints.lg}px)`);

  const items = list.map((image) => {
    return (
      <Box color="" sx={{ width: 640 }} mx="auto">
        <Img radius="md" src={image.url} alt={image.name} withPlaceholder />
      </Box>
    );
  });
  return <AliceCarousel mouseTracking items={items} />;
}
