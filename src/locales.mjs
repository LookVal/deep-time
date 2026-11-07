/**
 * deep-time — unit words for the 14 LookVal languages.
 *
 * Each unit maps Intl.PluralRules categories to the word that follows the
 * number. Missing categories fall back to `other` (the code does that, not
 * this file). Languages without plural forms (ja, id, vi, tr...) only need
 * `other`.
 *
 * The number-word separator and the list join differ per script:
 *   ja "1日3時間" (no space, no join), ko "1일 3시간" (space), en "1 day 3 hours".
 *
 * Big units are written as full phrases on purpose: "milion lat" (PL) needs
 * the count noun genitive, "million years" (EN) needs both words, so the
 * entry is the whole tail of the sentence.
 *
 * `attach: true` = the number glues to the word with no space (Korean
 * counters: "14.3억 년", never "14.3 억 년").
 * `scale` (optional) lets a locale show big units on ITS native numeric
 * scale instead of calquing English: 1.4 million years is "140万年" in
 * Japanese and "140만 년" in Korean (scale 100 on the man/만 unit), and
 * "14 लाख वर्ष" in Hindi (scale 10 on lakh). The number the caller sees
 * and formats is already scaled; the unit threshold stays universal.
 */

const EN = {
  second: { one: 'second', other: 'seconds' },
  minute: { one: 'minute', other: 'minutes' },
  hour: { one: 'hour', other: 'hours' },
  day: { one: 'day', other: 'days' },
  week: { one: 'week', other: 'weeks' },
  month: { one: 'month', other: 'months' },
  year: { one: 'year', other: 'years' },
  millennium: { one: 'millennium', other: 'millennia' },
  millionYears: { other: 'million years' },
  billionYears: { other: 'billion years' },
};

const DATA = {
  en: { space: ' ', join: ' ', units: EN },

  pl: {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'sekunda', few: 'sekundy', many: 'sekund', other: 'sekundy' },
      minute: { one: 'minuta', few: 'minuty', many: 'minut', other: 'minuty' },
      hour: { one: 'godzina', few: 'godziny', many: 'godzin', other: 'godziny' },
      day: { one: 'dzień', few: 'dni', many: 'dni', other: 'dnia' },
      week: { one: 'tydzień', few: 'tygodnie', many: 'tygodni', other: 'tygodnia' },
      month: { one: 'miesiąc', few: 'miesiące', many: 'miesięcy', other: 'miesiąca' },
      year: { one: 'rok', few: 'lata', many: 'lat', other: 'roku' },
      millennium: { one: 'tysiąclecie', few: 'tysiąclecia', many: 'tysiącleci', other: 'tysiąclecia' },
      millionYears: { one: 'milion lat', few: 'miliony lat', many: 'milionów lat', other: 'miliona lat' },
      billionYears: { one: 'miliard lat', few: 'miliardy lat', many: 'miliardów lat', other: 'miliarda lat' },
    },
  },

  es: {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'segundo', other: 'segundos' },
      minute: { one: 'minuto', other: 'minutos' },
      hour: { one: 'hora', other: 'horas' },
      day: { one: 'día', other: 'días' },
      week: { one: 'semana', other: 'semanas' },
      month: { one: 'mes', other: 'meses' },
      year: { one: 'año', other: 'años' },
      millennium: { one: 'milenio', other: 'milenios' },
      millionYears: { one: 'millón de años', many: 'millones de años', other: 'millones de años' },
      billionYears: { one: 'mil millones de años', many: 'mil millones de años', other: 'mil millones de años' },
    },
  },

  fr: {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'seconde', other: 'secondes' },
      minute: { one: 'minute', other: 'minutes' },
      hour: { one: 'heure', other: 'heures' },
      day: { one: 'jour', other: 'jours' },
      week: { one: 'semaine', other: 'semaines' },
      month: { one: 'mois', other: 'mois' },
      year: { one: 'an', other: 'ans' },
      millennium: { one: 'millénaire', other: 'millénaires' },
      millionYears: { one: "million d'années", other: "millions d'années" },
      billionYears: { one: "milliard d'années", other: "milliards d'années" },
    },
  },

  de: {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'Sekunde', other: 'Sekunden' },
      minute: { one: 'Minute', other: 'Minuten' },
      hour: { one: 'Stunde', other: 'Stunden' },
      day: { one: 'Tag', other: 'Tage' },
      week: { one: 'Woche', other: 'Wochen' },
      month: { one: 'Monat', other: 'Monate' },
      year: { one: 'Jahr', other: 'Jahre' },
      millennium: { one: 'Jahrtausend', other: 'Jahrtausende' },
      millionYears: { one: 'Million Jahre', other: 'Millionen Jahre' },
      billionYears: { one: 'Milliarde Jahre', other: 'Milliarden Jahre' },
    },
  },

  'pt-BR': {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'segundo', other: 'segundos' },
      minute: { one: 'minuto', other: 'minutos' },
      hour: { one: 'hora', other: 'horas' },
      day: { one: 'dia', other: 'dias' },
      week: { one: 'semana', other: 'semanas' },
      month: { one: 'mês', other: 'meses' },
      year: { one: 'ano', other: 'anos' },
      millennium: { one: 'milênio', other: 'milênios' },
      millionYears: { one: 'milhão de anos', many: 'milhões de anos', other: 'milhões de anos' },
      billionYears: { one: 'bilhão de anos', many: 'bilhões de anos', other: 'bilhões de anos' },
    },
  },

  it: {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'secondo', other: 'secondi' },
      minute: { one: 'minuto', other: 'minuti' },
      hour: { one: 'ora', other: 'ore' },
      day: { one: 'giorno', other: 'giorni' },
      week: { one: 'settimana', other: 'settimane' },
      month: { one: 'mese', other: 'mesi' },
      year: { one: 'anno', other: 'anni' },
      millennium: { one: 'millennio', other: 'millenni' },
      millionYears: { one: 'milione di anni', other: 'milioni di anni' },
      billionYears: { one: 'miliardo di anni', other: 'miliardi di anni' },
    },
  },

  hi: {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'सेकंड', other: 'सेकंड' },
      minute: { one: 'मिनट', other: 'मिनट' },
      hour: { one: 'घंटा', other: 'घंटे' },
      day: { one: 'दिन', other: 'दिन' },
      week: { one: 'सप्ताह', other: 'सप्ताह' },
      month: { one: 'महीना', other: 'महीने' },
      year: { one: 'साल', other: 'साल' },
      millennium: { other: 'हज़ार वर्ष' },
      millionYears: { other: 'लाख वर्ष', scale: 10 },
      billionYears: { other: 'अरब वर्ष' },
    },
  },

  id: {
    space: ' ',
    join: ' ',
    units: {
      second: { other: 'detik' },
      minute: { other: 'menit' },
      hour: { other: 'jam' },
      day: { other: 'hari' },
      week: { other: 'minggu' },
      month: { other: 'bulan' },
      year: { other: 'tahun' },
      millennium: { other: 'ribu tahun' },
      millionYears: { other: 'juta tahun' },
      billionYears: { other: 'miliar tahun' },
    },
  },

  tr: {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'saniye', other: 'saniye' },
      minute: { one: 'dakika', other: 'dakika' },
      hour: { one: 'saat', other: 'saat' },
      day: { one: 'gün', other: 'gün' },
      week: { one: 'hafta', other: 'hafta' },
      month: { one: 'ay', other: 'ay' },
      year: { one: 'yıl', other: 'yıl' },
      millennium: { other: 'binyıl' },
      millionYears: { other: 'milyon yıl' },
      billionYears: { other: 'milyar yıl' },
    },
  },

  nl: {
    space: ' ',
    join: ' ',
    units: {
      second: { one: 'seconde', other: 'seconden' },
      minute: { one: 'minuut', other: 'minuten' },
      hour: { one: 'uur', other: 'uur' },
      day: { one: 'dag', other: 'dagen' },
      week: { one: 'week', other: 'weken' },
      month: { one: 'maand', other: 'maanden' },
      year: { one: 'jaar', other: 'jaar' },
      millennium: { one: 'millennium', other: 'millennia' },
      millionYears: { other: 'miljoen jaar' },
      billionYears: { other: 'miljard jaar' },
    },
  },

  ja: {
    space: '',
    join: '',
    units: {
      second: { other: '秒' },
      minute: { other: '分' },
      hour: { other: '時間' },
      day: { other: '日' },
      week: { other: '週間' },
      month: { other: 'か月' },
      year: { other: '年' },
      millennium: { other: '千年' },
      millionYears: { other: '万年', scale: 100 },
      billionYears: { other: '億年', scale: 10 },
    },
  },

  vi: {
    space: ' ',
    join: ' ',
    units: {
      second: { other: 'giây' },
      minute: { other: 'phút' },
      hour: { other: 'giờ' },
      day: { other: 'ngày' },
      week: { other: 'tuần' },
      month: { other: 'tháng' },
      year: { other: 'năm' },
      millennium: { other: 'nghìn năm' },
      millionYears: { other: 'triệu năm' },
      billionYears: { other: 'tỷ năm' },
    },
  },

  ko: {
    // Numeral glues to the unit with no space (1일, 3시간, 14.3억).
    // The big-unit "year" carries its own space inside the word (억 년).
    // To add a new locale: copy the `en` block, translate the unit words,
    // set `space`/`join` for the script, and add `scale` only if the locale
    // uses a native numeric scale (man/억/lakh).
    space: '',
    join: ' ',
    units: {
      second: { other: '초' },
      minute: { other: '분' },
      hour: { other: '시간' },
      day: { other: '일' },
      week: { other: '주' },
      month: { other: '개월' },
      year: { other: '년' },
      millennium: { other: '천 년' },
      millionYears: { other: '만 년', scale: 100 },
      billionYears: { other: '억 년', scale: 10 },
    },
  },
};

export const SUPPORTED_LOCALES = Object.keys(DATA);

/**
 * Resolve a BCP-47 tag to the locale data. Exact tag first (pt-BR), then the
 * language part (pt -> pt-BR data), then English. Never throws.
 */
export function unitsFor(locale) {
  const tag = String(locale || 'en');
  let data = DATA[tag];
  if (!data) {
    const base = tag.split('-')[0];
    data = DATA[base] || (base === 'pt' ? DATA['pt-BR'] : null);
  }
  const d = data || DATA.en;

  const plural = new Intl.PluralRules(tag === 'pt' ? 'pt-BR' : tag);
  const formsOf = (unit) => d.units[unit] || EN[unit];
  const pick = (unit, n) => {
    const forms = formsOf(unit);
    const cat = plural.select(n);
    return forms[cat] || forms.other;
  };

  return {
    space: d.space,
    listJoin: d.join,
    /** Value re-expressed on the locale's native scale (e.g. man/억/lakh). */
    scaled(unit, valueInUnit) {
      const scale = formsOf(unit).scale;
      return scale ? valueInUnit * scale : valueInUnit;
    },
    format(n, unit, numFmt) {
      const word = pick(unit, n);
      const num = numFmt(n, unit);
      return num + d.space + word;
    },
  };
}
