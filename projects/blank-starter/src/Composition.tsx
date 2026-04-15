import { AbsoluteFill, useCurrentFrame } from "remotion";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill className="bg-black items-center justify-center">
      <div className="text-white text-6xl font-bold">
        Frame {frame}
      </div>
    </AbsoluteFill>
  );
};
