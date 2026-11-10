/**
 * deep-time — type definitions.
 * Runtime is plain ESM JavaScript; this file only describes the surface.
 */

export interface FormatOptions {
  /** BCP-47 tag. One of the 14 supported, falls back to `en`. Default `en`. */
  locale?: string;
  /** Units shown below a millennium: 1-3, default 2. Ignored at/above it. */
  maxParts?: number;
  /**
   * Format the numeric part yourself (decimal comma, digit grouping...).
   * Receives the value the default formatter would show (already rounded
   * to 3 significant digits on compact units) and the unit name.
   */
  numberFormat?: (n: number, unit: string) => string;
}

export interface Decomposed {
  /** Value expressed in `unit`, e.g. 1.4 when unit is `millionYears`. */
  value: number;
  /** Unit name: second | minute | hour | day | week | month | year | millennium | millionYears | billionYears */
  unit: string;
  /** Input echoed back, in seconds. */
  seconds: number;
}

export declare function formatDuration(seconds: number, opts?: FormatOptions): string;
export declare function formatDurationShort(seconds: number, opts?: FormatOptions): string;
export declare function decompose(seconds: number): Decomposed;
export declare const SUPPORTED_LOCALES: string[];
