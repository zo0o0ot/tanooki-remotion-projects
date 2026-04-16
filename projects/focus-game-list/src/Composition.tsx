import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Carousel, CAROUSEL_DURATION } from "./Carousel";
import { Grid } from "./Grid";
import { GAMES } from "./games";

// Grid: stagger + time for all cards to settle + hold
const GRID_STAGGER = 4;
const GRID_SETTLE = 60;
const GRID_HOLD = 90;
export const GRID_DURATION = GAMES.length * GRID_STAGGER + GRID_SETTLE + GRID_HOLD;

export const TOTAL_DURATION = CAROUSEL_DURATION + GRID_DURATION;

const CROSSFADE_FRAMES = 20;

export const FocusGameList: React.FC = () => {
  const frame = useCurrentFrame();

  const carouselOpacity = interpolate(
    frame,
    [CAROUSEL_DURATION - CROSSFADE_FRAMES, CAROUSEL_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const gridOpacity = interpolate(
    frame,
    [CAROUSEL_DURATION - CROSSFADE_FRAMES, CAROUSEL_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: carouselOpacity }}>
        <Carousel />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: gridOpacity }}>
        <Grid />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
