/**
 * deep-time — format long durations the way humans actually say them.
 *
 *   formatDuration(90)       -> "1 minute 30 seconds"
 *   formatDuration(4.42e13)  -> "1.4 million years"
 *
 * Unit ladder (second -> ... -> billion years) mirrors how people talk:
 * nobody says "453698 seconds", they say "5 days 6 hours". Below a millennium
 * we walk DOWN the ladder for up to `maxParts` units, skipping empty ones
 * ("1 week 2 hours", never "1 week 0 days 2 hours"). From a millennium up
 * we print ONE unit with a compact number, because "1.4 million years
 * 2 months" means nothing to anyone.
 *
 * Plurals come from Intl.PluralRules; unit words live in src/locales.mjs
 * (the 14 LookVal languages). Formatting of the number itself (decimal
 * comma vs dot, digit grouping) is the caller's job via `numberFormat`.
 */

import { unitsFor } from './locales.mjs';

/** Steps of the ladder, in seconds. Ascending: [threshold, unitName]. */
const STEPS = [
  [1, 'second'],
  [60, 'minute'],
  [3600, 'hour'],
  [86400, 'day'],
  [604800, 'week'],
  [2629800, 'month'], // 30.44 days (average month), same as Intl.DurationFormat
  [31557600, 'year'], // 365.25 days
  [31557600 * 1e3, 'millennium'],
  [31557600 * 1e6, 'millionYears'],
  [31557600 * 1e9, 'billionYears'],
];

/** Index of the first "huge" unit: from here on, one unit, compact number.
 *  Units below this index walk DOWN the ladder for `maxParts` parts;
 *  units at/above print ONE compact value ("1.4 million years").
 *  To add a rung (e.g. "decade", "century"): insert a [threshold, name]
 *  pair into STEPS in ascending order and bump COMPACT_FROM if needed,
 *  then add the unit word to every locale in src/locales.mjs. */
const COMPACT_FROM = 7;

function pickUnit(seconds) {
  let idx = 0;
  for (let i = 0; i < STEPS.length; i++) {
    if (seconds >= STEPS[i][0]) idx = i;
  }
  return { unit: STEPS[idx][1], threshold: STEPS[idx][0], index: idx };
}

/** Keep 3 significant digits for non-integers; integers stay exact. */
function round3(n) {
  return Number.isInteger(n) ? n : Number(n.toPrecision(3));
}

/**
 * Default numeric formatting: plain decimal, never scientific notation.
 * Tiny durations (1e-9 s) are written "0.000000001", not "1e-9" - a human
 * reads the first, a machine the second. Compact values stay below 1000 so
 * only sub-second fractions ever hit the exponent branch.
 */
function plainNumber(n) {
  const s = String(n);
  if (!/e/i.test(s)) return s;
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const decimals = Math.min(100, -exp + 2); // 3 significant digits
  return n.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '');
}

function assertValid(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds)) {
    throw new TypeError('seconds must be a finite number');
  }
  if (seconds < 0) throw new RangeError('negative durations are not supported');
}

/**
 * Format a duration in seconds for a locale.
 *
 * @param {number} seconds   duration (floats fine, negatives throw)
 * @param {object} [opts]
 * @param {string} [opts.locale='en']  BCP-47 tag; one of the 14, falls back to en
 * @param {number} [opts.maxParts=2]   units shown below a millennium (1-3)
 * @param {(n: number, unit: string) => string} [opts.numberFormat]
 *        format the numeric part yourself (decimal comma, grouping...).
 *        Receives the same value the default formatter would show
 *        (already rounded to 3 significant digits on big units).
 *        Default: plain decimal, never scientific notation.
 * @returns {string}
 */
export function formatDuration(seconds, opts = {}) {
  assertValid(seconds);

  const locale = opts.locale || 'en';
  const maxParts = Math.min(Math.max(opts.maxParts ?? 2, 1), 3);
  const numFmt = opts.numberFormat || plainNumber;
  const words = unitsFor(locale);

  // Sub-second: the ladder floor is "seconds", show the fraction.
  if (seconds < 1) return words.format(round3(seconds), 'second', numFmt);

  const { index } = pickUnit(seconds);

  // Huge scales: ONE unit, compact number, no tail noise. Locale may
  // re-express the value on its native scale (man/억/lakh) - see locales.mjs.
  if (index >= COMPACT_FROM) {
    // Rounding must not cross a rung: 999.7 million years is "1 billion
    // years", never "1000 million years". The ladder ratios are 1000, so
    // one promotion step is enough; the loop documents the invariant.
    let rung = index;
    while (rung < STEPS.length - 1 && round3(seconds / STEPS[rung][0]) >= 1000) {
      rung++;
    }
    const scaled = words.scaled(STEPS[rung][1], seconds / STEPS[rung][0]);
    return words.format(round3(scaled), STEPS[rung][1], numFmt);
  }

  // Human scales: walk DOWN the ladder, up to maxParts non-empty units.
  const parts = [];
  let rest = seconds;
  for (let i = index; i >= 0 && parts.length < maxParts; i--) {
    const [stepThreshold, stepUnit] = STEPS[i];
    const v = Math.floor(rest / stepThreshold);
    if (v >= 1) {
      parts.push(words.format(v, stepUnit, numFmt));
      rest -= v * stepThreshold;
    }
  }
  // seconds >= 1 guarantees at least the seconds unit; keep it honest anyway.
  if (!parts.length) parts.push(words.format(0, 'second', numFmt));

  return parts.join(words.listJoin);
}

/**
 * Same as formatDuration but rounds to a single unit ("1 day").
 * Useful in tight UI where "1 day 3 hours" does not fit.
 */
export function formatDurationShort(seconds, opts = {}) {
  return formatDuration(seconds, { ...opts, maxParts: 1 });
}

/**
 * The raw split, for callers that build their own sentences:
 * { value, unit, seconds } - e.g. { value: 1.4, unit: 'millionYears' }.
 */
export function decompose(seconds) {
  assertValid(seconds);
  const { unit, threshold } = pickUnit(seconds);
  return { value: seconds / threshold, unit, seconds };
}

/** List of supported locale tags. */
export { SUPPORTED_LOCALES } from './locales.mjs';
