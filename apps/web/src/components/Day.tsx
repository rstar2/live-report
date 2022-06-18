import { useEffect } from "react";
import { Button, Group, Text } from "@mantine/core";

import Images from "@/components/Images";
import { useImagesContext } from "@/state/images/context";

import "./Day.css";

type DayProps = {
  isYesterday?: boolean;
};

export default function Day({ isYesterday = false }: DayProps) {
  const context = useImagesContext();

  function refresh() {
    isYesterday ? context.refreshYesterday() : context.refreshToday();
  }

  // only once - on component mount, but also ensure globally once as this component may
  // wrapped in a router-component that is mounted/unmounted on url-history switching
  useEffect(() => {
    const isLoadedDay = isYesterday ? context.state.onceLoadedYesterday : context.state.onceLoadedToday;
    if (!isLoadedDay) refresh();
  }, [isYesterday]);

  return (
    <div>
      <Group mb={50}>
        <Text>{(isYesterday ? context.state.dateYesterday : context.state.dateToday).toDateString()}</Text>
        <Button onClick={refresh}>Refresh</Button>
      </Group>

      <Images list={isYesterday ? context.state.yesterday : context.state.today} />
    </div>
  );
}
