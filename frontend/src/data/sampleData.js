/**
 * Realistic Demo Batch Data for BroilerOS
 */

export const generateSampleData = () => {
  const now = new Date();
  
  // Batch started 24 days ago
  const startDateObj = new Date(now.getTime() - 24 * 86400000);
  const startDateStr = startDateObj.toISOString().slice(0, 10);

  const getDateStr = (offsetDays) => {
    const d = new Date(startDateObj.getTime() + offsetDays * 86400000);
    return d.toISOString().slice(0, 10);
  };

  return {
    batch: {
      name: "Alpha Flock 2026-B",
      date: startDateStr,
      birds: 1200,
      breed: "Cobb 500",
      supplier: "Kenbro Farms Hatchery Ltd",
      chickCost: 120000,
      targetAge: 42,
      targetWeight: 2600
    },
    weights: [
      { id: 1, date: getDateStr(0), sample: 50, avg: 44, min: 40, max: 48, notes: "Day-old chicks arrived in good vigor." },
      { id: 2, date: getDateStr(7), sample: 60, avg: 202, min: 185, max: 218, notes: "Exceeding Cobb benchmark target." },
      { id: 3, date: getDateStr(14), sample: 70, avg: 510, min: 475, max: 545, notes: "Good flock uniformity (>88%)." },
      { id: 4, date: getDateStr(21), sample: 80, avg: 1040, min: 980, max: 1110, notes: "Transitioned to grower pellets seamlessly." },
      { id: 5, date: getDateStr(24), sample: 85, avg: 1260, min: 1190, max: 1340, notes: "Active feeding and high vitality." }
    ],
    feeds: [
      { id: 101, date: getDateStr(0), type: "purchase", category: "Starter", qty: 600, cost: 42000, notes: "High protein 22% starter crumbles (12 bags)" },
      { id: 102, date: getDateStr(7), type: "consumption", category: "Starter", qty: 210, cost: 0, notes: "Week 1 cumulative feeding" },
      { id: 103, date: getDateStr(12), type: "purchase", category: "Grower", qty: 1200, cost: 78000, notes: "Balanced grower pellets 20% (24 bags)" },
      { id: 104, date: getDateStr(14), type: "consumption", category: "Starter", qty: 380, cost: 0, notes: "Week 2 feed consumption" },
      { id: 105, date: getDateStr(21), type: "consumption", category: "Grower", qty: 620, cost: 0, notes: "Week 3 feed consumption" },
      { id: 106, date: getDateStr(24), type: "consumption", category: "Grower", qty: 310, cost: 0, notes: "Days 22-24 feed consumption" }
    ],
    health: [
      { id: 201, name: "Marek's & IB Spray", date: getDateStr(0), type: "Vaccination", method: "Hatchery spray", status: "Completed", notes: "Hatchery verified" },
      { id: 202, name: "Glucose Rehydration + Vit Stress", date: getDateStr(1), type: "Vitamins", method: "Drinking water", status: "Completed", notes: "All birds drinking eagerly" },
      { id: 203, name: "Gumboro (IBD 1st Dose)", date: getDateStr(7), type: "Vaccination", method: "Drinking water", status: "Completed", notes: "Blue dye showed 96% intake" },
      { id: 204, name: "Newcastle Lasota + IB", date: getDateStr(14), type: "Vaccination", method: "Drinking water", status: "Completed", notes: "Administered in cool morning water" },
      { id: 205, name: "Gumboro (IBD 2nd Booster)", date: getDateStr(21), type: "Vaccination", method: "Drinking water", status: "Completed", notes: "2nd dose completed" },
      { id: 206, name: "Newcastle Booster (Lasota)", date: getDateStr(28), type: "Vaccination", method: "Drinking water", status: "Pending", notes: "Final booster scheduled" },
      { id: 207, name: "Pre-Slaughter Health Audit", date: getDateStr(38), type: "Health check", method: "Visual & Vet inspection", status: "Pending", notes: "Flock readiness assessment" }
    ],
    deaths: [
      { id: 301, date: getDateStr(1), qty: 5, cause: "Transport dehydration and weak spraddle leg" },
      { id: 302, date: getDateStr(3), qty: 3, cause: "Smothering in corner during chilling" },
      { id: 303, date: getDateStr(8), qty: 4, cause: "Ascites / small runts culled" },
      { id: 304, date: getDateStr(15), qty: 2, cause: "Heart failure / Sudden Death Syndrome" },
      { id: 305, date: getDateStr(22), qty: 3, cause: "Natural mortality" }
    ],
    finances: [
      { id: 401, date: getDateStr(0), type: "Expense", description: "Bedding - Wood shavings (3 truckloads)", amount: 15000 },
      { id: 402, date: getDateStr(0), type: "Expense", description: "Disinfection & brooding gas heating", amount: 12500 },
      { id: 403, date: getDateStr(7), type: "Expense", description: "Vaccines (Gumboro & Newcastle)", amount: 8400 },
      { id: 404, date: getDateStr(15), type: "Expense", description: "Farm attendant bi-weekly labor stipend", amount: 18000 },
      { id: 405, date: getDateStr(23), type: "Sale", description: "50 early heavyweight cockerels to local restaurant", amount: 37500, qty: 50, weight: 1.25 }
    ]
  };
};
