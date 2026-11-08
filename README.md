# deep-time

Format long durations the way humans actually say them.

```js
import { formatDuration } from 'deep-time';

formatDuration(90);        // "1 minute 30 seconds"
formatDuration(4.42e13);   // "1.4 million years"
formatDuration(4.42e13, { locale: 'de' });  // "1,4 Millionen Jahre"
formatDuration(4.42e13, { locale: 'ja' });  // "140万年"
formatDuration(4.42e13, { locale: 'hi' });  // "14 लाख वर्ष"
```

`Intl.DurationFormat` and `Intl.RelativeTimeFormat` stop at years and have
no plural-correct words for "1.4 million years", "3 millennia" or "1.4
billion years". Geology, astronomy, pop-science comparisons and calculators
("at $5,000/month, this fortune takes 14.3 million years to earn") all need
exactly that.

## What it does

- **Unit ladder**: second → minute → hour → day → week → month → year →
  millennium → million years → billion years.
- **Below one year**: walks down the ladder for up to `maxParts` non-empty
  units — `1 day 3 hours`, never `1 week 0 days 2 hours`.
- **Above one year**: one unit, compact number — `1.4 million years`,
  not `1 year 4 months 2 weeks`. At that scale the tail is noise.
- **Plural-correct** in 14 languages via `Intl.PluralRules` — German
  `Million/Millionen Jahre`, Spanish `millón/millones de años`, and
  languages with four plural categories (`1 rok / 3 lata / 5 lat`).
- **Native numeric scales**: 1.4 million years is `140万年` in Japanese and
  `14.3억 년` in Korean (man/억 scale), `14 लाख वर्ष` in Hindi (lakh) —
  not an English calque. English is `1.4 million years`, as it should be.
- **Script-aware spacing**: Japanese glues (`1日1時間`), Korean attaches the
  numeral to the counter (`1일 1시간`), European languages space-separate.
- **Zero dependencies**, ~250 lines, works in Node ≥ 14 and every browser
  (plain ESM).

## Install

```bash
npm install deep-time
```

## API

### `formatDuration(seconds, opts?)`

```js
formatDuration(98700);                    // "1 day 3 hours 25 minutes"
formatDuration(98700, { maxParts: 1 });   // "1 day"
formatDuration(98700, { maxParts: 3 });   // "1 day 3 hours 25 minutes"
formatDuration(4.42e13, { locale: 'de' }); // "1,4 Millionen Jahre" (see below)
```

| Option | Default | What |
|---|---|---|
| `locale` | `'en'` | BCP-47 tag; unknown → `en`; `pt` → `pt-BR` data |
| `maxParts` | `2` | units below one year (1–3); ignored above |
| `numberFormat` | built-in | `(n, unit) => string` — decimal comma, grouping, digits |

The built-in number style keeps 3 significant digits on compact units
(`1.43 billion years`) and prints integers plain (`36 hours`). For a decimal
comma:

```js
formatDuration(4.42e13, {
  locale: 'de',
  numberFormat: n => n.toLocaleString('de-DE', { maximumFractionDigits: 1 }),
}); // "1,4 Millionen Jahre"
```

### `formatDurationShort(seconds, opts?)`

One unit only: `formatDurationShort(90000)` → `"1 day"`. For tight UI.

### `decompose(seconds)`

Raw split for custom sentences:

```js
decompose(4.42e13); // { value: 1.4, unit: 'millionYears', seconds: 4.42e13 }
```

### `SUPPORTED_LOCALES`

`['en','pl','es','fr','de','pt-BR','it','hi','id','tr','nl','ja','vi','ko']`

Missing a language you need? `src/locales.mjs` is one plain object per
locale — PRs welcome.

## When NOT to use this

- Durations under a minute with sub-second precision → `Intl.DurationFormat`.
- Timers, countdowns, stopwatches → you want a ticker, not a formatter.
- "3 days ago" relative labels → `Intl.RelativeTimeFormat`.

## Tests

```bash
npm test   # 15 cases: ladder, plurals, native scales, script spacing, errors
```

## Why

Built by the team behind [lookval.com](https://lookval.com) — a set of
calculators in 14 languages, where every second tool has to say something
like "14.3 million years" correctly in all of them. `deep-time` is the library we built to solve it.

## License

MIT
