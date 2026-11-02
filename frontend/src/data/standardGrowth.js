/**
 * Commercial Broiler Standard Performance Benchmarks
 * Data reference: Cobb 500 & Ross 308 Broiler Performance Objectives
 */

export const STANDARD_GROWTH = {
  cobb500: [
    { day: 0, weight: 42, dailyFeed: 15, cumFeed: 15 },
    { day: 7, weight: 195, dailyFeed: 32, cumFeed: 172 },
    { day: 14, weight: 490, dailyFeed: 64, cumFeed: 520 },
    { day: 21, weight: 985, dailyFeed: 106, cumFeed: 1145 },
    { day: 28, weight: 1610, dailyFeed: 150, cumFeed: 2070 },
    { day: 35, weight: 2320, dailyFeed: 188, cumFeed: 3280 },
    { day: 42, weight: 3040, dailyFeed: 215, cumFeed: 4720 },
  ],
  ross308: [
    { day: 0, weight: 42, dailyFeed: 14, cumFeed: 14 },
    { day: 7, weight: 200, dailyFeed: 31, cumFeed: 168 },
    { day: 14, weight: 505, dailyFeed: 66, cumFeed: 525 },
    { day: 21, weight: 1010, dailyFeed: 110, cumFeed: 1160 },
    { day: 28, weight: 1650, dailyFeed: 155, cumFeed: 2110 },
    { day: 35, weight: 2370, dailyFeed: 192, cumFeed: 3340 },
    { day: 42, weight: 3100, dailyFeed: 220, cumFeed: 4800 },
  ],
};

export const getExpectedWeightForDay = (breed = 'cobb500', day = 1) => {
  const table = breed.toLowerCase().includes('ross') ? STANDARD_GROWTH.ross308 : STANDARD_GROWTH.cobb500;
  if (day <= 0) return 42;
  if (day >= 42) return table[table.length - 1].weight;

  // Linear interpolation between weekly benchmarks
  for (let i = 0; i < table.length - 1; i++) {
    const current = table[i];
    const next = table[i + 1];
    if (day >= current.day && day <= next.day) {
      const progress = (day - current.day) / (next.day - current.day);
      return Math.round(current.weight + progress * (next.weight - current.weight));
    }
  }
  return 42;
};
