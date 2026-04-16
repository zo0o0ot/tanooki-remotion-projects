import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GAMES } from "./games";

// 19 games → 5 columns, 4 rows (last row has 4, centered)
const COLS = 5;
const ROWS = Math.ceil(GAMES.length / COLS);
const GAP = 16;

// Stagger delay per card (frames)
const STAGGER = 4;

export const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cardW = (width - GAP * (COLS + 1)) / COLS;
  const cardH = cardW * (215 / 460); // match Steam header capsule ratio
  const gridH = ROWS * cardH + (ROWS - 1) * GAP;
  const gridTop = (height - gridH) / 2;

  return (
    <AbsoluteFill style={{ background: "#09090b" }}>
      {GAMES.map((game, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);

        // Center last partial row
        const lastRowCount = GAMES.length % COLS || COLS;
        const isLastRow = row === ROWS - 1;
        const colOffset = isLastRow ? (COLS - lastRowCount) / 2 : 0;

        const x = GAP + (col + colOffset) * (cardW + GAP);
        const y = gridTop + row * (cardH + GAP);

        const delay = i * STAGGER;
        const localFrame = Math.max(0, frame - delay);

        const scale = spring({
          frame: localFrame,
          fps,
          config: { damping: 18, stiffness: 180, mass: 0.6 },
        });

        const opacity = Math.min(localFrame / 8, 1);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: cardW,
              height: cardH,
              borderRadius: 8,
              overflow: "hidden",
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            <Img
              src={staticFile(`images/${game.image}`)}
              style={{ width: "100%", height: "100%", objectFit: "fill" }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
