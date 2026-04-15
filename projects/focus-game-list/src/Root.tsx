import "./index.css";
import { Composition } from "remotion";
import { FocusGameList, TOTAL_DURATION } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FocusGameList"
        component={FocusGameList}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
