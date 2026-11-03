/**
 * Cobb 500 Broiler Performance Standards
 * Source: Cobb 500 Broiler Performance & Nutrition Supplement,
 *         as-hatched metric performance objectives, revised July 2015.
 *         Cobb Africa reference values — per bird.
 *
 * targetWeight : grams per bird at END of that day
 * feedPerBird  : grams of feed consumed by ONE bird on that specific day
 */

export const COBB_STANDARDS = [
  { day:  1, targetWeight:   56, feedPerBird:  13 },
  { day:  2, targetWeight:   72, feedPerBird:  17 },
  { day:  3, targetWeight:   89, feedPerBird:  21 },
  { day:  4, targetWeight:  109, feedPerBird:  23 },
  { day:  5, targetWeight:  131, feedPerBird:  27 },
  { day:  6, targetWeight:  157, feedPerBird:  31 },
  { day:  7, targetWeight:  185, feedPerBird:  35 },
  { day:  8, targetWeight:  215, feedPerBird:  39 },
  { day:  9, targetWeight:  247, feedPerBird:  44 },
  { day: 10, targetWeight:  283, feedPerBird:  48 },
  { day: 11, targetWeight:  321, feedPerBird:  54 },
  { day: 12, targetWeight:  364, feedPerBird:  58 },
  { day: 13, targetWeight:  412, feedPerBird:  64 },
  { day: 14, targetWeight:  465, feedPerBird:  68 },
  { day: 15, targetWeight:  524, feedPerBird:  75 },
  { day: 16, targetWeight:  586, feedPerBird:  81 },
  { day: 17, targetWeight:  651, feedPerBird:  87 },
  { day: 18, targetWeight:  719, feedPerBird:  93 },
  { day: 19, targetWeight:  790, feedPerBird:  98 },
  { day: 20, targetWeight:  865, feedPerBird: 105 },
  { day: 21, targetWeight:  943, feedPerBird: 111 },
  { day: 22, targetWeight: 1023, feedPerBird: 117 },
  { day: 23, targetWeight: 1104, feedPerBird: 123 },
  { day: 24, targetWeight: 1186, feedPerBird: 130 },
  { day: 25, targetWeight: 1269, feedPerBird: 134 },
  { day: 26, targetWeight: 1353, feedPerBird: 141 },
  { day: 27, targetWeight: 1438, feedPerBird: 148 },
  { day: 28, targetWeight: 1524, feedPerBird: 152 },
  { day: 29, targetWeight: 1613, feedPerBird: 158 },
  { day: 30, targetWeight: 1705, feedPerBird: 163 },
  { day: 31, targetWeight: 1799, feedPerBird: 169 },
  { day: 32, targetWeight: 1895, feedPerBird: 174 },
  { day: 33, targetWeight: 1993, feedPerBird: 180 },
  { day: 34, targetWeight: 2092, feedPerBird: 182 },
  { day: 35, targetWeight: 2191, feedPerBird: 189 },
  { day: 36, targetWeight: 2289, feedPerBird: 193 },
  { day: 37, targetWeight: 2386, feedPerBird: 197 },
  { day: 38, targetWeight: 2482, feedPerBird: 201 },
  { day: 39, targetWeight: 2577, feedPerBird: 205 },
  { day: 40, targetWeight: 2671, feedPerBird: 209 },
  { day: 41, targetWeight: 2764, feedPerBird: 213 },
  { day: 42, targetWeight: 2857, feedPerBird: 216 },
];

/** Map for O(1) lookup by day number */
const COBB_MAP = Object.fromEntries(COBB_STANDARDS.map((r) => [r.day, r]));

/**
 * Get Cobb 500 standard for a given flock age (day).
 * Returns null if day is out of range (< 1 or > 42).
 */
export function getCobbStandard(day) {
  return COBB_MAP[day] ?? null;
}

/**
 * Compute total daily feed needed for the whole flock (in kg).
 * @param {number} feedPerBirdG  - grams per bird per day from COBB_STANDARDS
 * @param {number} liveBirds     - number of birds alive today
 * @returns {number} kilograms of feed for the flock
 */
export function flockDailyFeedKg(feedPerBirdG, liveBirds) {
  return (feedPerBirdG * liveBirds) / 1000;
}

/**
 * Cumulative feed consumption per bird from day 1 up to (and including) `day`.
 * @param {number} day
 * @returns {number} grams per bird (cumulative)
 */
export function cumulativeFeedPerBirdG(day) {
  const cap = Math.min(day, 42);
  return COBB_STANDARDS.slice(0, cap).reduce((sum, r) => sum + r.feedPerBird, 0);
}

/**
 * Performance status from actual vs target.
 * Returns 'excellent' | 'good' | 'warning' | 'poor'
 */
export function weightStatus(actualG, targetG) {
  if (!actualG || !targetG) return 'unknown';
  const pct = (actualG / targetG) * 100;
  if (pct >= 98)  return 'excellent';
  if (pct >= 90)  return 'good';
  if (pct >= 80)  return 'warning';
  return 'poor';
}

export function feedStatus(actualKg, targetKg) {
  if (!actualKg || !targetKg) return 'unknown';
  const pct = (actualKg / targetKg) * 100;
  // Feed: close to target is good; over by > 15% or under by > 15% is warning
  if (pct >= 95 && pct <= 115)  return 'excellent';
  if (pct >= 85 && pct <= 125)  return 'good';
  if (pct >= 70 && pct <= 140)  return 'warning';
  return 'poor';
}
