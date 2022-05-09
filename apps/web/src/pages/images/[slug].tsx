import { useParams } from "react-router-dom";

function Image() {
  const { slug } = useParams<{ slug: string }>();
  return <div className="Image">Image YYY {slug}</div>;
}

export default Image;
