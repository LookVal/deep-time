import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration, formatDurationShort, decompose, SUPPORTED_LOCALES } from '../src/index.mjs';
import { unitsFor } from '../src/locales.mjs';

// ── ladder sanity ────────────────────────────────────────────────────────────
test('basic ladder (en)', () => {
  assert.equal(formatDuration(30), '30 seconds');
  assert.equal(formatDuration(90), '1 minute 30 seconds');
  assert.equal(formatDuration(3600), '1 hour');
  assert.equal(formatDuration(90000), '1 day 1 hour');
  assert.equal(formatDuration(604800), '1 week');
  assert.equal(formatDuration(2629800), '1 month');
  assert.equal(formatDuration(31557600), '1 year');
});

test('one unit only (maxParts 1)', () => {
  assert.equal(formatDurationShort(90000), '1 day');
  assert.equal(formatDuration(90000, { maxParts: 1 }), '1 day');
});

test('three units (maxParts 3)', () => {
  // 1 day + 3 h + 25 min = 98 700 s (86400 + 10800 + 1500)
  assert.equal(formatDuration(98700, { maxParts: 3 }), '1 day 3 hours 25 minutes');
});

test('big scales: one unit, compact number', () => {
  // 1.4M years ≈ 4.42e13 s
  assert.equal(formatDuration(4.42e13), '1.4 million years');
  assert.equal(formatDuration(4.5e16), '1.43 billion years');
  assert.equal(formatDuration(31557600 * 1000 * 3), '3 millennia');
  // years still take the remainder: "1 year 1 day" is human
  assert.equal(formatDuration(31557600 + 86400 * 2), '1 year 2 days');
});

test('rounds to 3 significant digits on compact units', () => {
  assert.equal(formatDuration(4.525e13), '1.43 million years');
  // below a year: walk-down, not fractions ("2 hours 3 minutes" > "2.06 hours")
  assert.equal(formatDuration(123.4 * 60), '2 hours 3 minutes');
  assert.equal(formatDuration(3600 * 150), '6 days 6 hours'); // walk-down beats 150 hours
  assert.equal(formatDuration(3600 * 5, { maxParts: 1 }), '5 hours'); // integer, no rounding
});

// ── languages ────────────────────────────────────────────────────────────────
test('plural forms follow Intl.PluralRules', () => {
  assert.equal(formatDuration(31557600, { locale: 'es' }), '1 año');
  assert.equal(formatDuration(31557600 * 5, { locale: 'es' }), '5 años');
  assert.equal(formatDuration(31557600 * 5, { locale: 'de' }), '5 Jahre');
  assert.equal(formatDuration(31557600 * 5, { locale: 'fr' }), '5 ans');
  assert.equal(formatDuration(31557600 * 5, { locale: 'it' }), '5 anni');
  // four-category languages pick a different noun for 1 / 3 / 5
  assert.equal(formatDuration(31557600, { locale: 'pl' }), '1 rok');
  assert.equal(formatDuration(31557600 * 3, { locale: 'pl' }), '3 lata');
  assert.equal(formatDuration(31557600 * 5, { locale: 'pl' }), '5 lat');
});

test('fractional years walk down to the next unit', () => {
  // the half goes to the smaller unit, not a fraction: 12 years 6 months
  assert.equal(formatDuration(31557600 * 12.5), '12 years 6 months');
  assert.equal(formatDuration(31557600 * 12.5, { locale: 'es' }), '12 años 6 meses');
});

test('decimal comma via numberFormat', () => {
  const comma = (n) => String(n).replace('.', ',');
  assert.equal(
    formatDuration(4.42e13, { locale: 'de', numberFormat: comma }),
    '1,4 Millionen Jahre'
  );
});

test('ja: no spaces, native man-scale for big units', () => {
  assert.equal(formatDuration(90000, { locale: 'ja' }), '1日1時間');
  // 1.4M years = 140 × 10k years ("140万年"), not a calque "1.4百万年"
  assert.equal(formatDuration(4.42e13, { locale: 'ja' }), '140万年');
});

test('ko: numeral attaches to unit, native ok-scale', () => {
  assert.equal(formatDuration(90000, { locale: 'ko' }), '1일 1시간');
  // 1.43B years = 14.3 × 100M years ("14.3억 년")
  assert.equal(formatDuration(4.5e16, { locale: 'ko' }), '14.3억 년');
});

test('hi: lakh/arab terms (native scale, not English calque)', () => {
  // 1.4M years = 14 lakh (×10 scale); 1.43B years = 1.43 arab (arab = 1e9,
  // so no rescaling - neither a "1.43 billion" calque nor a wrong scale)
  assert.equal(formatDuration(4.42e13, { locale: 'hi' }), '14 लाख वर्ष');
  assert.equal(formatDuration(4.5e16, { locale: 'hi' }), '1.43 अरब वर्ष');
});

test('unknown locale falls back to en, pt maps to pt-BR', () => {
  assert.equal(formatDuration(90, { locale: 'xx-YY' }), '1 minute 30 seconds');
  assert.equal(formatDuration(31557600, { locale: 'pt' }), '1 ano');
  assert.equal(formatDuration(31557600, { locale: 'pt-BR' }), '1 ano');
  assert.equal(SUPPORTED_LOCALES.length, 14);
});

test('all 14 locales produce non-empty output across the ladder', () => {
  const samples = [30, 90000, 2629800, 4.42e13, 4.5e16];
  for (const loc of SUPPORTED_LOCALES) {
    for (const s of samples) {
      const out = formatDuration(s, { locale: loc });
      assert.ok(out && out.length > 0, `${loc} empty for ${s}`);
    }
  }
});

// ── errors and API surface ───────────────────────────────────────────────────
test('throws on invalid input', () => {
  assert.throws(() => formatDuration(NaN));
  assert.throws(() => formatDuration(-5));
  assert.throws(() => formatDuration('90'));
  assert.throws(() => decompose(-1));
});

test('decompose gives raw split', () => {
  const d = decompose(4.42e13);
  assert.equal(d.unit, 'millionYears');
  assert.ok(Math.abs(d.value - 1.4) < 0.01);
  assert.equal(decompose(90).unit, 'minute');
});

test('unitsFor plural pick matches Intl.PluralRules', () => {
  const es = unitsFor('es');
  assert.equal(es.format(1, 'year', String), '1 año');
  assert.equal(es.format(5, 'year', String), '5 años');
  const pl = unitsFor('pl');
  assert.equal(pl.format(1, 'year', String), '1 rok');
  assert.equal(pl.format(3, 'year', String), '3 lata');
  assert.equal(pl.format(5, 'year', String), '5 lat');
  // CJK: many == other
  const j = unitsFor('ja');
  assert.equal(j.listJoin, '');
});
