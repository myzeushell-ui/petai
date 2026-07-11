/**
 * Deterministic, seedable PRNG (mulberry32).
 *
 * The whole simulation must be reproducible from a seed for testing and saving,
 * so `Math.random` is never used in game logic. The RNG state lives in
 * GameState.rngState; helpers here advance it and return both the value and the
 * next state so callers stay pure.
 */

export interface RngResult {
  value: number; // 0..1
  state: number;
}

/** Advance the RNG one step. */
export function nextRandom(state: number): RngResult {
  let t = (state + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, state: t >>> 0 };
}

/** Random integer in [min, max] inclusive. */
export function randomInt(state: number, min: number, max: number): RngResult {
  const r = nextRandom(state);
  const value = Math.floor(r.value * (max - min + 1)) + min;
  return { value, state: r.state };
}

/** Random float in [min, max). */
export function randomRange(state: number, min: number, max: number): RngResult {
  const r = nextRandom(state);
  return { value: min + r.value * (max - min), state: r.state };
}

/** Returns true with probability `p` (0..1). */
export function chance(state: number, p: number): { value: boolean; state: number } {
  const r = nextRandom(state);
  return { value: r.value < p, state: r.state };
}

/** Derive an initial 32-bit state from an arbitrary seed number. */
export function seedState(seed: number): number {
  // Scramble so nearby seeds diverge quickly.
  let h = seed >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = (h ^ (h >>> 16)) >>> 0;
  return h;
}
