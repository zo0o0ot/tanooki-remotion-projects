import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GAMES } from "./games";

const CARD_W = 380;
const CARD_H = 214; // 16:9
const CARD_GAP = 32;
const CARD_STRIDE = CARD_W + CARD_GAP;

// How many frames each card is the "active" center card before advancing
const FRAMES_PER_CARD = 45;

export const Carousel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Smoothly advance through each card
  const rawIndex = frame / FRAMES_PER_CARD;
  const targetIndex = Math.min(rawIndex, GAMES.length - 1);
  const scrollX = spring({
    frame,
    fps,
    from: 0,
    to: targetIndex * CARD_STRIDE,
    config: { damping: 28, stiffness: 120, mass: 1 },
  });

  const centerX = width / 2;

  return (
    <AbsoluteFill className="bg-zinc-950 items-center justify-center">
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          top: "50%",
          left: centerX - scrollX,
          transform: "translateY(-50%)",
          gap: CARD_GAP,
        }}
      >
        {GAMES.map((game, i) => {
          const distFromCenter = (i * CARD_STRIDE - scrollX) / CARD_STRIDE;
          const absD = Math.abs(distFromCenter);

          const scale = interpolate(absD, [0, 1, 2], [1.15, 0.9, 0.75], {
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(absD, [0, 1.5, 2.5], [1, 0.6, 0.2], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                width: CARD_W,
                height: CARD_H,
                flexShrink: 0,
                borderRadius: 10,
                overflow: "hidden",
                transform: `scale(${scale})`,
                opacity,
                boxShadow: absD < 0.3 ? "0 0 40px rgba(255,255,255,0.15)" : "none",
                transition: "box-shadow 0.1s",
              }}
            >
              <Img
                src={staticFile(`images/${game.image}`)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
