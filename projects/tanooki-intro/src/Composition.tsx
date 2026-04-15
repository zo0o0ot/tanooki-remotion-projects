import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Img,
  staticFile,
  Series,
} from "remotion";

// ─── ROM CHECK SCREEN ────────────────────────────────────────────────────────

const C = "#ffffff";

const ROM_ROWS = [
  { loc: "K0",  status: "OK", checksum: "4E5F1A" },
  { loc: "K2",  status: "OK", checksum: "8169F0" },
  { loc: "J0",  status: "OK", checksum: "A58DAC" },
  { loc: "J2",  status: "OK", checksum: "CFF5E4" },
  { loc: "K13", status: "OK", checksum: "037C83" },
  { loc: "K19", status: "OK", checksum: "3FA1D4" },
  { loc: "J13", status: "OK", checksum: "8D5A0E" },
  { loc: "J19", status: "OK", checksum: "B38734" },
];

const ROW_INTERVAL = 2;
const ROWS_START = 8;
const ALL_ROWS_DONE = ROWS_START + ROM_ROWS.length * ROW_INTERVAL;
const CHECK_COMPLETE_FRAME = ALL_ROWS_DONE + 3;

const ROMCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const checkCompleteVisible = frame >= CHECK_COMPLETE_FRAME;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Press Start 2P', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {/* Header */}
        <div style={{ fontSize: 38, color: C, letterSpacing: "0.12em", marginBottom: 56 }}>
          CHARACTER ROM CHECK
        </div>

        {/* Rows — all pre-laid-out, pop in when their frame arrives */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start" }}>
          {ROM_ROWS.map((row, i) => {
            const rowFrame = ROWS_START + i * ROW_INTERVAL;
            const visible = frame >= rowFrame;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 48,
                  fontSize: 32,
                  color: C,
                  opacity: visible ? 1 : 0,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span style={{ minWidth: 90, display: "inline-block" }}>{row.loc}</span>
                <span style={{ minWidth: 60, display: "inline-block" }}>{row.status}</span>
                <span style={{ letterSpacing: "0.1em" }}>{row.checksum}</span>
              </div>
            );
          })}
        </div>

        {/* CHECK COMPLETE */}
        <div
          style={{
            marginTop: 56,
            fontSize: 32,
            color: C,
            letterSpacing: "0.1em",
            opacity: checkCompleteVisible ? 1 : 0,
          }}
        >
          CHECK COMPLETE
        </div>

        {/* © line */}
        <div
          style={{
            marginTop: 48,
            fontSize: 24,
            color: C,
            letterSpacing: "0.1em",
            opacity: checkCompleteVisible ? 1 : 0,
          }}
        >
          © TANOOKI ZOOT
        </div>
      </div>

    </div>
  );
};

// ─── MAIN INTRO ──────────────────────────────────────────────────────────────


const Scanlines: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 4px)",
      opacity,
      pointerEvents: "none",
      zIndex: 100,
    }}
  />
);

const Particle: React.FC<{
  x: number; y: number; size: number; color: string; delay: number; frame: number;
}> = ({ x, y, size, color, delay, frame }) => {
  const localFrame = Math.max(0, frame - delay);
  const float = Math.sin(frame * 0.05 + delay * 0.3) * 10;
  const opacity = interpolate(localFrame, [0, 8, 70, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
      }}
    />
  );
};

const PixelGrid: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const offset = (frame * 1.5) % 40;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,80,200,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,80,200,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: `${offset}px ${offset}px`,
        opacity,
      }}
    />
  );
};

const Sparkle: React.FC<{
  x: number; y: number; frame: number; delay: number; fps: number;
}> = ({ x, y, frame, delay, fps }) => {
  const local = Math.max(0, frame - delay);
  const cycle = local % 45;
  const scale = spring({ frame: cycle, fps, config: { damping: 8, stiffness: 300, mass: 0.3 } });
  const opacity = interpolate(cycle, [0, 5, 32, 45], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {(
        [[8,0,4,4],[8,16,4,4],[0,8,4,4],[16,8,4,4],[4,4,4,4],[12,4,4,4],[4,12,4,4],[12,12,4,4]] as [number,number,number,number][]
      ).map(([lx, ly, w, h], i) => (
        <div key={i} style={{ position: "absolute", left: lx, top: ly, width: w, height: h, backgroundColor: i < 4 ? "#ffffff" : "#ffaadd" }} />
      ))}
    </div>
  );
};

const PixelTitle: React.FC<{
  text: string; frame: number; fps: number; startFrame: number;
  fontSize: number; color: string; shadowColor: string;
}> = ({ text, frame, fps, startFrame, fontSize, color, shadowColor }) => (
  <div style={{ display: "flex", flexWrap: "nowrap" }}>
    {text.split("").map((char, i) => {
      const cf = Math.max(0, frame - startFrame - i * 2);
      const opacity = interpolate(cf, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const sy = spring({ frame: cf, fps, config: { damping: 14, stiffness: 220, mass: 0.5 } });
      const dy = interpolate(cf, [0, 12], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity,
            transform: `translateY(${dy}px) scaleY(${sy})`,
            transformOrigin: "bottom center",
            fontSize,
            fontFamily: "'Press Start 2P', monospace",
            color,
            textShadow: `3px 3px 0px ${shadowColor}, 0 0 24px ${color}, 0 0 48px ${color}60`,
            whiteSpace: "pre",
          }}
        >
          {char}
        </span>
      );
    })}
  </div>
);

const MainIntro: React.FC = () => {
  const frame = useCurrentFrame() + 22;
  const { fps, width, height } = useVideoConfig();

  const CHAR_X = 90;
  const CHAR_W = 390;
  const TEXT_X = 580;
  const TITLE_FONT = 96;
  const TITLE_START = 35;

  const bgOpacity = interpolate(frame, [18, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gridOpacity = interpolate(frame, [8, 35], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const charProgress = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 16, stiffness: 85, mass: 0.9 } });
  const charX = interpolate(charProgress, [0, 1], [-CHAR_W - 20, CHAR_X]);
  const charOpacity = interpolate(frame, [20, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const charBob = Math.sin(frame * 0.09) * 5;

  const lineOpacity = interpolate(frame, [18, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scanOpacity = interpolate(frame, [0, 20], [0.6, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gradShift = Math.sin(frame * 0.025) * 8;

  const particles = [
    { x: 920, y: 120, size: 8, color: "#ff44bb", delay: 70 },
    { x: 980, y: 260, size: 6, color: "#ff88ff", delay: 78 },
    { x: 860, y: 390, size: 10, color: "#ffaadd", delay: 75 },
    { x: 1120, y: 180, size: 6, color: "#ff66cc", delay: 82 },
    { x: 1180, y: 330, size: 8, color: "#ff44bb", delay: 88 },
    { x: 840, y: 510, size: 6, color: "#ff88ff", delay: 94 },
    { x: 1060, y: 490, size: 8, color: "#ffaadd", delay: 80 },
    { x: 770, y: 180, size: 6, color: "#ff66cc", delay: 86 },
  ];

  const sparkles = [
    { x: CHAR_X + CHAR_W + 20, y: height / 2 - 100, delay: 42 },
    { x: CHAR_X + CHAR_W - 20, y: height / 2 + 50,  delay: 50 },
    { x: CHAR_X + CHAR_W + 60, y: height / 2 + 10,  delay: 46 },
    { x: CHAR_X + 60,          y: height / 2 - 150, delay: 54 },
  ];

  const pressStartOpacity = interpolate(frame, [90, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blink = frame > 96 ? Math.floor((frame - 96) / 20) % 2 === 0 ? 1 : 0.15 : 1;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000008",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${48 + gradShift}% 52%, #0d0d35 20%, #06061a 60%, #000008 100%)`,
          opacity: bgOpacity,
        }}
      />

      <PixelGrid frame={frame} opacity={gridOpacity} />

      <div style={{ position: "absolute", top: height * 0.62, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 2%, #ff44bb 25%, #ff44bb 75%, transparent 98%)", opacity: lineOpacity * 0.7, boxShadow: "0 0 12px #ff44bb, 0 0 24px #ff44bb60" }} />
      <div style={{ position: "absolute", top: height * 0.62 + 5, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 5%, #ff88ff 30%, #ff88ff 70%, transparent 95%)", opacity: lineOpacity * 0.45 }} />

      {particles.map((p, i) => <Particle key={i} {...p} frame={frame} />)}

      <div
        style={{
          position: "absolute",
          left: charX,
          top: height / 2 - 300 + charBob,
          opacity: charOpacity,
          filter: "drop-shadow(0 0 18px rgba(120,200,255,0.65)) drop-shadow(0 0 40px rgba(100,180,255,0.35))",
        }}
      >
        <Img src={staticFile("character.png")} style={{ width: CHAR_W, height: "auto", imageRendering: "pixelated" }} />
      </div>

      {sparkles.map((s, i) => <Sparkle key={i} {...s} frame={frame} fps={fps} />)}

      <div style={{ position: "absolute", left: TEXT_X, top: height / 2 - 120, display: "flex", flexDirection: "column", gap: 20 }}>
        <PixelTitle text="TanookiZoot" frame={frame} fps={fps} startFrame={TITLE_START} fontSize={TITLE_FONT} color="#ff66dd" shadowColor="#660033" />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 72,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 32,
          color: "#ffffff",
          letterSpacing: "0.15em",
          textShadow: "2px 2px 0px #660033, 0 0 16px #ff44bb, 0 0 32px #ff44bb60",
          opacity: pressStartOpacity * blink,
          zIndex: 60,
        }}
      >
        PRESS START
      </div>

      <Scanlines opacity={scanOpacity} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
          zIndex: 95,
        }}
      />
    </div>
  );
};

// ─── ROOT COMPOSITION ─────────────────────────────────────────────────────────

export const MyComposition: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={ALL_ROWS_DONE + 21}>
      <ROMCheck />
    </Series.Sequence>
    <Series.Sequence durationInFrames={188}>
      <MainIntro />
    </Series.Sequence>
  </Series>
);
