/**
 * Deterministic id generation.
 *
 * Ids are derived from a monotonic counter carried in GameState, never from
 * Date.now/Math.random, so replays and saves stay reproducible. Callers thread
 * the counter through and store the returned `next` value back into state.
 */

export interface IdResult {
  id: string;
  next: number;
}

export function makeId(prefix: string, counter: number): IdResult {
  return { id: `${prefix}_${counter}`, next: counter + 1 };
}
