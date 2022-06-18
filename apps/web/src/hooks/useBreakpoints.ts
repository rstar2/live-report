import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function useBreakpoints() {
  const theme = useMantineTheme();

  const xsAndUp = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);
  const xsAndDown = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  const smAndUp = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  const smAndDown = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const mdAndUp = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);
  const mdAndDown = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const lgAndUp = useMediaQuery(`(min-width: ${theme.breakpoints.lg}px)`);
  const lgAndDown = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);

  const xlAndUp = useMediaQuery(`(min-width: ${theme.breakpoints.xl}px)`);
  const xlAndDown = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  return {
    xsAndUp,
    xsAndDown,

    smAndUp,
    smAndDown,

    mdAndUp,
    mdAndDown,

    lgAndUp,
    lgAndDown,

    xlAndUp,
    xlAndDown,
  };
}
