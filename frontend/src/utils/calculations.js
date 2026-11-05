/**
 * BroilerOS Poultry Metrics & Formula Calculations
 */

export const getTodayString = () => new Date().toISOString().slice(0, 10);

export const ageAtDate = (dateStr, startDateStr) => {
  if (!startDateStr || !dateStr) return null;
  const start = new Date(startDateStr + 'T00:00:00');
  const target = new Date(dateStr + 'T00:00:00');
  const diffDays = Math.floor((target - start) / 86400000);
  return Math.max(1, diffDays + 1);
};

export const currentAge = (startDateStr) => {
  return ageAtDate(getTodayString(), startDateStr);
};

export const formatNumber = (num, decimals = 1) => {
  const val = Number(num);
  if (isNaN(val) || num === null || num === undefined) return '0';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(val) ? 0 : decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCurrency = (num, currency = 'KSh', forceDecimals = false) => {
  const val = Number(num);
  if (isNaN(val)) return `${currency} 0`;
  const isZeroDecimal = currency === 'KSh' || currency === '₦' || currency === 'R' || currency === 'UGX' || currency === 'TZS';
  const decimals = forceDecimals ? 2 : isZeroDecimal ? 0 : 2;
  return `${currency} ${val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const calculateFlockMetrics = (batch, weights = [], feeds = [], deaths = [], finances = []) => {
  const initialChicks = Number(batch?.birds || 0);

  // Deaths
  const totalDeaths = deaths.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);
  const mortalityRate = initialChicks > 0 ? (totalDeaths / initialChicks) * 100 : 0;
  const survivalRate = Math.max(0, 100 - mortalityRate);

  // Sales
  const salesRecords = finances.filter((f) => f.type === 'Sale');
  const totalSoldBirds = salesRecords.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);
  const totalSoldWeightKg = salesRecords.reduce((acc, curr) => {
    const qty = Number(curr.qty) || 0;
    const wt = Number(curr.weight) || 0; // wt in kg per bird or total
    return acc + (qty * wt);
  }, 0);

  // Live Birds
  const liveBirds = Math.max(0, initialChicks - totalDeaths - totalSoldBirds);

  // Weights
  const sortedWeights = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  const latestWeightRecord = sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1] : null;
  const latestAvgWeightGrams = latestWeightRecord ? Number(latestWeightRecord.avg) : 0;
  const latestAvgWeightKg = latestAvgWeightGrams / 1000;

  // Average Daily Gain (ADG)
  let adg = 0;
  const currentFlockAge = currentAge(batch?.date) || 1;
  if (latestAvgWeightGrams > 0 && currentFlockAge > 0) {
    const chickStartingWeight = 42; // standard day-1 chick weight in grams
    adg = Math.max(0, (latestAvgWeightGrams - chickStartingWeight) / currentFlockAge);
  }

  // Feed Metrics
  const feedPurchasedKg = feeds
    .filter((f) => f.type === 'purchase')
    .reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);

  const feedConsumedKg = feeds
    .filter((f) => f.type === 'consumption')
    .reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);

  const feedStockRemainingKg = feedPurchasedKg - feedConsumedKg;

  const feedExpenses = feeds
    .filter((f) => f.type === 'purchase')
    .reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

  // Feed Conversion Ratio (FCR)
  // Total Biomass = (Live birds * current wt kg) + total weight of sold birds kg
  const currentBiomassKg = (liveBirds * latestAvgWeightKg) + totalSoldWeightKg;
  let fcr = 0;
  if (currentBiomassKg > 0 && feedConsumedKg > 0) {
    fcr = feedConsumedKg / currentBiomassKg;
  }

  // EPEF (European Production Efficiency Factor)
  // EPEF = (Survival % * Live Weight kg) / (Age in Days * FCR) * 100
  let epef = 0;
  if (currentFlockAge > 0 && fcr > 0 && latestAvgWeightKg > 0) {
    epef = (survivalRate * latestAvgWeightKg) / (currentFlockAge * fcr) * 100;
  }

  // Financials
  const directExpenses = finances
    .filter((f) => f.type === 'Expense')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  
  // Note: Chick purchase cost in batch settings can be added to initial expenses
  const chickInitialCost = Number(batch?.chickCost || 0);
  const totalExpenses = directExpenses + feedExpenses + chickInitialCost;

  const totalRevenue = salesRecords.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const costPerLiveBird = liveBirds > 0 ? totalExpenses / (liveBirds + totalSoldBirds) : 0;

  return {
    initialChicks,
    totalDeaths,
    mortalityRate,
    survivalRate,
    totalSoldBirds,
    liveBirds,
    latestAvgWeightGrams,
    latestAvgWeightKg,
    currentFlockAge,
    adg,
    feedPurchasedKg,
    feedConsumedKg,
    feedStockRemainingKg,
    feedExpenses,
    fcr,
    epef,
    totalExpenses,
    totalRevenue,
    netProfit,
    costPerLiveBird,
  };
};
