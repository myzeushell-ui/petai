/** Small pure helpers shared across the simulation. No side effects. */

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/** Clamp to the 0..100 trait/percentage range. */
export function clampStat(value: number): number {
  return clamp(Math.round(value), 0, 100);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

/**
 * Format elapsed game minutes as a night clock. The scenario starts at 22:00
 * (dusk) and dawn arrives after `durationMinutes`.
 */
export function formatClock(minutesSinceStart: number, startHour = 22): string {
  const total = startHour * 60 + Math.floor(minutesSinceStart);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Human "42 минуты" style duration in Russian. */
export function formatMinutes(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  const mod10 = m % 10;
  const mod100 = m % 100;
  let word = "минут";
  if (mod10 === 1 && mod100 !== 11) word = "минуту";
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) word = "минуты";
  return `${m} ${word}`;
}

export function pluralSoldiers(n: number): string {
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} воин`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} воина`;
  return `${n} воинов`;
}

export function capitalize(text: string): string {
  return text.length ? text[0].toUpperCase() + text.slice(1) : text;
}

/** Pick a deterministic item from a list using a 0..1 roll. */
export function pickBy<T>(items: readonly T[], roll: number): T {
  if (items.length === 0) throw new Error("pickBy: empty list");
  const i = Math.min(items.length - 1, Math.floor(clamp01(roll) * items.length));
  return items[i];
}
