/** Procedural heraldic crest generated deterministically from a seed. */

function hash(seed: number): number {
  let h = (seed * 2654435761) >>> 0;
  h ^= h >>> 15;
  return h >>> 0;
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}

export function Crest({
  seed,
  accent,
  size = 42,
  className = "crest",
}: {
  seed: number;
  accent: string;
  size?: number;
  className?: string;
}) {
  const h = hash(seed);
  const charge = h % 4; // which emblem
  const division = (h >> 3) % 3; // field division
  const dark = shade(accent, -70);
  const light = shade(accent, 30);

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" role="img" aria-hidden>
      <defs>
        <clipPath id={`shield-${seed}`}>
          <path d="M4 4 H36 V22 C36 32 28 37 20 39 C12 37 4 32 4 22 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#shield-${seed})`}>
        <rect x="0" y="0" width="40" height="40" fill={dark} />
        {division === 0 && <rect x="20" y="0" width="20" height="40" fill={accent} />}
        {division === 1 && <rect x="0" y="20" width="40" height="20" fill={accent} />}
        {division === 2 && <polygon points="0,0 40,0 0,40" fill={accent} />}

        {charge === 0 && (
          <polygon points="20,9 24,17 20,15 16,17" fill={light} stroke={dark} strokeWidth="0.6" />
        )}
        {charge === 1 && (
          <path d="M20 8 L23 14 L29 15 L24.5 19 L26 25 L20 22 L14 25 L15.5 19 L11 15 L17 14 Z" fill={light} />
        )}
        {charge === 2 && (
          <>
            <rect x="18.5" y="9" width="3" height="18" fill={light} />
            <rect x="12" y="15" width="16" height="3" fill={light} />
          </>
        )}
        {charge === 3 && (
          <path d="M10 26 L20 10 L30 26 Z" fill="none" stroke={light} strokeWidth="2.4" />
        )}
      </g>
      <path
        d="M4 4 H36 V22 C36 32 28 37 20 39 C12 37 4 32 4 22 Z"
        fill="none"
        stroke={shade(accent, 60)}
        strokeWidth="1.4"
      />
    </svg>
  );
}
