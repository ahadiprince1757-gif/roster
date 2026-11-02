/**
 * Standard Broiler Vaccination & Preventive Health Protocols
 */

export const RECOMMENDED_PROTOCOLS = [
  {
    dayOffset: 1,
    name: "Marek's & IB (Infectious Bronchitis)",
    type: "Vaccination",
    method: "Hatchery Spray / Subcutaneous",
    notes: "Usually administered at hatchery upon hatching. Verify hatchery certificate."
  },
  {
    dayOffset: 1,
    name: "Glucose & Stress Electrolytes",
    type: "Vitamins",
    method: "Drinking water",
    notes: "Provide warm electrolyte + dextrose water on arrival for initial rehydration."
  },
  {
    dayOffset: 7,
    name: "Gumboro (IBD - Intermediate Plus)",
    type: "Vaccination",
    method: "Drinking water (skimmed milk stabilizer)",
    notes: "Withdraw water for 1.5 - 2 hrs prior to administration. Ensure cool water without chlorine."
  },
  {
    dayOffset: 14,
    name: "Newcastle Disease (Lasota / Hitchner B1) + IB",
    type: "Vaccination",
    method: "Eye drop or drinking water",
    notes: "Protect against Newcastle Disease. Provide multivitamins following evening."
  },
  {
    dayOffset: 18,
    name: "Multivitamins & Amino Acids Booster",
    type: "Vitamins",
    method: "Drinking water",
    notes: "Growth acceleration and gut integrity booster during starter-grower transition."
  },
  {
    dayOffset: 21,
    name: "Gumboro (IBD) Booster (2nd Dose)",
    type: "Vaccination",
    method: "Drinking water",
    notes: "Critical secondary protection against bursal viral challenge."
  },
  {
    dayOffset: 28,
    name: "Newcastle Disease (Lasota Booster)",
    type: "Vaccination",
    method: "Drinking water",
    notes: "Pre-slaughter immunity booster."
  }
];
