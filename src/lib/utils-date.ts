/**
 * Tiny date helpers — avoid pulling a full date library for trivial math.
 */

export type DateInput = Date | string | number;

function toDate(d: DateInput): Date {
  return d instanceof Date ? new Date(d.getTime()) : new Date(d);
}

export function addDays(d: DateInput, n: number): Date {
  const out = toDate(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function addMonths(d: DateInput, n: number): Date {
  const out = toDate(d);
  out.setMonth(out.getMonth() + n);
  return out;
}
