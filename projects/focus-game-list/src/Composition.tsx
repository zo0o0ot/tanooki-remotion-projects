import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Carousel } from "./Carousel";
import { Grid } from "./Grid";
import { GAMES } from "./games";

// Carousel: ~45 frames per card + a beat to rest on the last one
const FRAMES_PER_CARD = 45;
const CAROUSEL_HOLD = 30; // extra frames resting on last card before transition
export const CAROUSEL_DURATION = GAMES.length * FRAMES_PER_CARD + CAROUSEL_HOLD;

// Grid: stagger + time for all cards to settle + hold
const GRID_STAGGER = 4;
const GRID_SETTLE = 60;
const GRID_HOLD = 90;
export const GRID_DURATION = GAMES.length * GRID_STAGGER + GRID_SETTLE + GRID_HOLD;

export const TOTAL_DURATION = CAROUSEL_DURATION + GRID_DURATION;

// Brief cross-fade between the two phases
const CROSSFADE_FRAMES = 20;

export const FocusGameList: React.FC = () => {
  const frame = useCurrentFrame();

  const gridOpacity = interpolate(
    frame,
    [CAROUSEL_DURATION - CROSSFADE_FRAMES, CAROUSEL_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const carouselOpacity = interpolate(
    frame,
    [CAROUSEL_DURATION - CROSSFADE_FRAMES, CAROUSEL_DURATION],
    [1, 0],
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
