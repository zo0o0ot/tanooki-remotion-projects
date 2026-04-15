import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TanookiZootIntro"
        component={MyComposition}
        durationInFrames={233}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
