import { useCallback, useEffect, useState } from "react";
import { ThemeIcon, Image as Img, createStyles, Text, Box } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, TablerIcon } from "@tabler/icons";
import useEmblaCarousel from "embla-carousel-react";

import { Image } from "@/types";
// import useBreakpoints from "@/hooks/useBreakpoints";

import "./Images.css";

export type ImagesProps = {
  list: Image[];
};

const SCALE_FACTOR = 3;

const numberWithinRange = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export default function Images({ list }: ImagesProps) {
  return list.length ? <ImagesCarousel list={list} /> : <Text align="center">No images yet</Text>;
}

function ImagesCarousel({ list }: ImagesProps) {
  //   const { xsAndUp, mdAndUp, lgAndUp } = useBreakpoints();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scaleValues, setScaleValues] = useState([] as any[]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // scale while scrolling - taken from the example
  // https://codesandbox.io/s/embla-carousel-scale-react-j2ulk
  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      if (!emblaApi.slidesInView().includes(index)) return 0;
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target().get();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      const scale = 1 - Math.abs(diffToTarget * SCALE_FACTOR);
      return numberWithinRange(scale, 0, 1);
    });
    setScaleValues(styles);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("resize", onScroll);
    onSelect();
    onScroll();
  }, [emblaApi]);

  return (
    <>
      {/* <Box>Is xs : {"" + xsAndUp}</Box>
      <Box>Is md : {"" + mdAndUp}</Box>
      <Box>Is lg : {"" + lgAndUp}</Box> */}

      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {list.map((image, index) => (
              <div className="embla__slide" key={index}>
                <Box
                  className="embla__slide__inner"
                  sx={(theme) => ({
                    transform: `scale(${scaleValues[index]})`,
                    height: "520px",

                    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                      height: "460px",
                    },
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                      height: "340px",
                    },
                  })}
                >
                  <ImageItem image={image} />
                </Box>
              </div>
            ))}
          </div>
        </div>
        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
      </div>
      <div className="embla__dots">
        {list.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
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
      classNames={{ image: "embla__slide__img" }}
      styles={{
        root: { height: "100%" },
        figure: { height: "100%" },
        imageWrapper: { height: "calc(100% - 30px)" },
        caption: { marginTop: "15px" },
      }}
    />
    //   </Box>
  );
}

function PrevNextButton({
  enabled,
  onClick,
  Icon,
  isNext,
}: {
  Icon: TablerIcon;
  isNext?: boolean;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <ThemeIcon
      size="xl"
      variant="outline"
      sx={(theme) => ({
        position: "absolute",
        top: "50%",
        right: isNext ? 0 : undefined,
        transform: `translateY(-50%) ${isNext ? "translateX(-50%)" : ""}`,
        border: "none",
        color: enabled ? theme.primaryColor : theme.colors.gray[5],
        cursor: enabled ? "pointer" : "default",
      })}
      onClick={onClick}
    >
      {/* size="" - use the size of the ActionIcon */}
      <Icon size="" />
    </ThemeIcon>
  );
}

function PrevButton(props: { enabled: boolean; onClick: () => void }) {
  return <PrevNextButton Icon={IconChevronLeft} {...props} />;
}
function NextButton(props: { enabled: boolean; onClick: () => void }) {
  return <PrevNextButton Icon={IconChevronRight} isNext {...props} />;
}

const useStylesDotButton = createStyles((theme, { selected }: { selected: boolean }) => ({
  dot: {
    [`&:after`]: {
      backgroundColor: selected ? theme.primaryColor : theme.white,
    },
  },
}));

function DotButton({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  const { classes } = useStylesDotButton({ selected });
  return <button className={`embla__dot ${classes.dot}`} onClick={onClick} />;
}
