/**
 * AssetRegistry — typed access to the V3 Art Pack.
 *
 * Assets live in `src/assets/v3/` and are pulled through Vite's asset pipeline
 * (`import.meta.glob`), so the normal build emits hashed files and the
 * single-file artifact build inlines them as data URIs — one code path, both
 * targets, no hotlinking. Metadata (scale, anchor, dimensions) comes from
 * `asset-manifest.json`, the single source of truth shipped with the pack.
 */

import rawManifest from "./v3/asset-manifest.json";

export type AssetCategory =
  | "building"
  | "terrain_landmark"
  | "strategic_unit"
  | "prop"
  | "portrait";

export interface GameAsset {
  id: string;
  /** Manifest path, e.g. "/assets/v3/buildings/castle_dawns_edge.webp". */
  path: string;
  /** Resolved, loadable URL (hashed file or inlined data URI). */
  url: string;
  category: AssetCategory;
  usage: string;
  /** Display scale relative to the ORIGINAL art width (see origWidth). */
  recommendedScale: number;
  anchor: [number, number];
  /** Dimensions of the shipped (optimized) file. */
  width: number;
  height: number;
  /** Dimensions of the original art the scale was calibrated against. */
  origWidth: number;
  origHeight: number;
  hasAlpha: boolean;
}

interface RawAsset {
  id: string;
  path: string;
  category: string;
  usage: string;
  recommendedScale: number;
  anchor: number[];
  width: number;
  height: number;
  origWidth?: number;
  origHeight?: number;
  hasAlpha: boolean;
}

// Vite resolves every packed asset to a URL at build time (inlined in the
// single-file build, hashed otherwise). Keyed by "./v3/<category>/<file>".
const urlModules = import.meta.glob<string>("./v3/**/*.{webp,jpg,png}", {
  eager: true,
  import: "default",
});

/** Artifact builds may inject an inline map keyed by manifest path. */
function inlineOverride(path: string): string | undefined {
  const g = globalThis as unknown as { __AIK_ASSETS__?: Record<string, string> };
  return g.__AIK_ASSETS__?.[path];
}

function resolveUrl(path: string): string {
  const key = "./v3/" + path.replace("/assets/v3/", "");
  return inlineOverride(path) ?? urlModules[key] ?? path;
}

const raw = rawManifest as { assets: RawAsset[] };

export const ASSETS: Record<string, GameAsset> = {};
for (const a of raw.assets) {
  ASSETS[a.id] = {
    id: a.id,
    path: a.path,
    url: resolveUrl(a.path),
    category: a.category as AssetCategory,
    usage: a.usage,
    recommendedScale: a.recommendedScale,
    anchor: [a.anchor[0] ?? 0.5, a.anchor[1] ?? 0.5],
    width: a.width,
    height: a.height,
    origWidth: a.origWidth ?? a.width,
    origHeight: a.origHeight ?? a.height,
    hasAlpha: a.hasAlpha,
  };
}

export function getAsset(id: string): GameAsset | undefined {
  return ASSETS[id];
}

export function assetUrl(id: string): string | undefined {
  return ASSETS[id]?.url;
}

export function assetsByCategory(cat: AssetCategory): GameAsset[] {
  return Object.values(ASSETS).filter((a) => a.category === cat);
}

/* ------------------------------------------------------------------ */
/* Image loading — cache, preload with progress, graceful fallback     */
/* ------------------------------------------------------------------ */

const imageCache = new Map<string, HTMLImageElement>();
const failed = new Set<string>();

/** Returns a decoded image from cache, or null if not (yet) loaded / failed. */
export function getImage(id: string): HTMLImageElement | null {
  return imageCache.get(id) ?? null;
}

export function hasFailed(id: string): boolean {
  return failed.has(id);
}

function loadOne(asset: GameAsset): Promise<void> {
  if (imageCache.has(asset.id) || failed.has(asset.id)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      imageCache.set(asset.id, img);
      resolve();
    };
    img.onerror = () => {
      failed.add(asset.id);
      resolve(); // never reject — callers fall back to procedural drawing
    };
    img.src = asset.url;
  });
}

export interface PreloadHandle {
  total: number;
  loaded: number;
}

/**
 * Preload every (or a filtered subset of) asset, reporting progress. Resolves
 * once all attempts settle; failures are recorded, not thrown.
 */
export async function preloadAssets(
  onProgress?: (loaded: number, total: number) => void,
  filter?: (a: GameAsset) => boolean,
): Promise<PreloadHandle> {
  const list = Object.values(ASSETS).filter((a) => (filter ? filter(a) : true));
  const total = list.length;
  let loaded = 0;
  await Promise.all(
    list.map((a) =>
      loadOne(a).then(() => {
        loaded += 1;
        onProgress?.(loaded, total);
      }),
    ),
  );
  return { total, loaded };
}

/** Device-pixel-ratio, clamped so we never over-render on hi-DPR phones. */
export function dpr(): number {
  const d = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return Math.min(2, Math.max(1, d));
}
