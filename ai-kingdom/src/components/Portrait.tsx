import { useState } from "react";
import { Crest } from "./Crest";
import {
  portraitAsset,
  portraitAccent,
  portraitFaction,
  type PortraitState,
} from "../assets/portraits";

interface PortraitProps {
  characterKey: string;
  state?: PortraitState;
  /** Rendered box height in px; width follows the shape. */
  size?: number;
  shape?: "card" | "round" | "tall";
  /** Fallback crest seed/accent when the image is missing. */
  crestSeed?: number;
  accent?: string;
  /** Dim / desaturate (e.g. dead officer, inactive speaker). */
  dim?: boolean;
  ring?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const RATIO: Record<NonNullable<PortraitProps["shape"]>, number> = {
  round: 1,
  card: 0.82,
  tall: 0.74,
};

/** State → CSS filter + overlay, so one neutral portrait can read many moods. */
function stateStyle(state: PortraitState): {
  filter: string;
  overlay: string;
} {
  switch (state) {
    case "wounded":
      return {
        filter: "saturate(0.85) contrast(1.05) brightness(0.92)",
        overlay: "radial-gradient(60% 50% at 50% 30%, rgba(140,20,15,0.28), transparent 70%)",
      };
    case "angry":
      return {
        filter: "saturate(1.15) contrast(1.08) brightness(0.98)",
        overlay: "linear-gradient(180deg, rgba(150,40,25,0.18), transparent 55%)",
      };
    case "worried":
      return {
        filter: "saturate(0.9) brightness(0.9) contrast(1.02)",
        overlay: "linear-gradient(180deg, rgba(30,50,80,0.22), transparent 60%)",
      };
    case "exhausted":
      return {
        filter: "saturate(0.7) brightness(0.9)",
        overlay: "linear-gradient(180deg, rgba(20,20,20,0.25), transparent 60%)",
      };
    case "victorious":
      return {
        filter: "saturate(1.1) brightness(1.06) contrast(1.03)",
        overlay: "radial-gradient(70% 60% at 50% 25%, rgba(230,197,107,0.24), transparent 72%)",
      };
    default:
      return { filter: "saturate(1.02) contrast(1.02)", overlay: "" };
  }
}

/**
 * Framed character portrait. Uses the Art Pack image with a face-focused crop
 * and a faction-colored medieval frame; falls back to the procedural crest if
 * the image is unavailable.
 */
export default function Portrait({
  characterKey,
  state = "neutral",
  size = 44,
  shape = "card",
  crestSeed,
  accent,
  dim = false,
  ring = false,
  className = "",
  style,
}: PortraitProps) {
  const [broken, setBroken] = useState(false);
  const asset = portraitAsset(characterKey, state);
  const frameAccent = accent ?? portraitAccent(characterKey) ?? "#c9a24a";
  const faction = portraitFaction(characterKey);
  const w = Math.round(size * RATIO[shape]);
  const { filter, overlay } = stateStyle(state);

  const box: React.CSSProperties = {
    position: "relative",
    width: w,
    height: size,
    borderRadius: shape === "round" ? "50%" : Math.max(6, size * 0.12),
    overflow: "hidden",
    flex: "0 0 auto",
    border: `1.5px solid ${frameAccent}`,
    boxShadow: ring
      ? `0 0 0 2px ${frameAccent}, 0 0 16px ${frameAccent}88, inset 0 0 22px rgba(0,0,0,0.55)`
      : `inset 0 0 22px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.45)`,
    background:
      faction === "enemy"
        ? "linear-gradient(180deg,#2a1512,#160a08)"
        : "linear-gradient(180deg,#1a2233,#0e1420)",
    filter: dim ? "grayscale(0.85) brightness(0.55)" : undefined,
    ...style,
  };

  if (!asset || broken) {
    return (
      <div className={`portrait ${className}`} style={box}>
        <div style={{ display: "grid", placeItems: "center", width: "100%", height: "100%" }}>
          <Crest seed={crestSeed ?? 1} accent={frameAccent} size={Math.round(size * 0.66)} />
        </div>
      </div>
    );
  }

  return (
    <div className={`portrait ${className}`} style={box}>
      <img
        src={asset.url}
        alt=""
        draggable={false}
        onError={() => setBroken(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 18%",
          display: "block",
          filter,
        }}
      />
      {/* mood overlay */}
      {overlay && (
        <span style={{ position: "absolute", inset: 0, background: overlay, pointerEvents: "none" }} />
      )}
      {/* vignette for cohesion */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: "inset 0 -18px 28px rgba(0,0,0,0.55), inset 0 6px 14px rgba(0,0,0,0.35)",
          background:
            "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
