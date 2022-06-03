import { useEffect } from "react";
import { Button, Group, Text } from "@mantine/core";

import { withLayout } from "@/components/Layout";
import Images from "@/components/Images";

import "./today.css";
import { useImagesContext } from "@/state/images/context";

function Today() {
  const { state, refreshToday } = useImagesContext();

  // only once - on component mount, but also ensure globally once as this component may
  // wrapped in a router-component that is mounted/unmounted on url-history switching
  useEffect(() => {
    if (!state.onceLoadedToday) refreshToday();
  }, []);

  return (
    <div>
      <Group>
        <Text>Today's images</Text>
        <Button onClick={() => refreshToday()}>Refresh</Button>
      </Group>

      <Images list={state.today} />
    </div>
  );
}

export default withLayout(Today);
