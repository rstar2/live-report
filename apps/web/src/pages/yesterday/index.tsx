import { withLayout } from "@/components/Layout";
import Day from "@/components/Day";

function Yesterday() {
  return <Day isYesterday />;
}

export default withLayout(Yesterday);
