import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { GAMES } from "./games";

const CARD_W = 460;
const CARD_H = 215;

// Cylinder geometry.
// Minimum radius for zero screen-space overlap with 19 cards of width 460px:
//   R > (CARD_W/2) / tan(π/N) = 230 / tan(π/19) ≈ 1378px
// 1420 gives a comfortable buffer above the minimum.
const RADIUS = 1420;

// Perspective depth. With the center card sitting at z=RADIUS, the apparent scale factor
// is P/(P-R). At P=2100 and R=1300: 2100/800 = 2.625×, so 460px → ~1207px apparent width
// (63% of the 1920px frame). Increase P to shrink the center card; decrease to grow it.
const PERSPECTIVE = 2100;

const ANGLE_PER_CARD = 360 / GAMES.length; // ≈ 21.18° between adjacent cards

const CARD_Y_OFFSET = -30; // px above vertical center

export const FRAMES_PER_CARD = 50;
export const CAROUSEL_HOLD = 50;
export const CAROUSEL_DURATION = GAMES.length * FRAMES_PER_CARD + CAROUSEL_HOLD;

export const Carousel: React.FC = () => {
  const frame = useCurrentFrame();

  const rawProgress = Math.min(frame / FRAMES_PER_CARD, GAMES.length - 1);
  const activeIndex = Math.floor(rawProgress);
  const fraction = rawProgress - activeIndex;
  const easedFraction = Easing.inOut(Easing.cubic)(fraction);
  const smoothProgress = Math.min(activeIndex + easedFraction, GAMES.length - 1);

  // The entire cylinder rotates; the active card is always brought to the front.
  const cylinderRotation = -smoothProgress * ANGLE_PER_CARD;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 40%, #282828 0%, #0a0a0a 100%)",
      }}
    >
      {/* Perspective container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: PERSPECTIVE,
          perspectiveOrigin: `50% calc(50% + ${CARD_Y_OFFSET}px)`,
        }}
      >
        {/* Cylinder pivot — centered on screen, rotates to bring active card forward */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `calc(50% + ${CARD_Y_OFFSET}px)`,
            transformStyle: "preserve-3d",
            transform: `rotateY(${cylinderRotation}deg)`,
          }}
        >
          {GAMES.map((game, i) => {
            const angle = i * ANGLE_PER_CARD;

            // Compute how directly this card faces the viewer in world space.
            // cylinderRotation rotates the whole cylinder, so the card's world angle is:
            const worldAngle = angle + cylinderRotation;
            // Normalize to [0, 360) then fold to [0, 180] — 0° = facing viewer, 180° = facing away.
            const normalized = ((worldAngle % 360) + 360) % 360;
            const facingAngle = normalized > 180 ? 360 - normalized : normalized;
            // cos(facingAngle): 1 at 0° (directly facing), 0 at 90° (edge-on), negative past 90°.
            // backfaceVisibility:hidden already hides >90° cards, but opacity=0 at exactly 90°
            // prevents any single-frame flash at the hard-cull boundary.
            const opacity = Math.max(0, Math.cos((facingAngle * Math.PI) / 180));

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  borderRadius: 8,
                  overflow: "hidden",
                  // Each card sits on the cylinder surface, facing outward.
                  // rotateY positions it at the correct angle; translateZ pushes it to the rim.
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                  opacity,
                  boxShadow: "0 16px 60px rgba(0,0,0,0.8)",
                }}
              >
                <Img
                  src={staticFile(`images/${game.image}`)}
                  style={{ width: "100%", height: "100%", objectFit: "fill" }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 75% at 50% 48%, transparent 25%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
