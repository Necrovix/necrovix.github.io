// Built-in snapshot data (indicative values, rounded from public sources:
// Catalysis-Hub / literature for activity, USGS / market data for price, Ember / OWID for grids).
// Replace with fresh downloads any time; the app only reads these objects.
const REACTIONS = {
  ammonia: {
    name: "Ammonia (Haber-Bosch)", product: "Ammonia", pubchem: "ammonia", mw: 17.03,
    eq: "N₂ + 3H₂ ⇌ 2NH₃", T: [300, 550, 450], P: [50, 300, 150],
    t50: 400, w: 50, p0: 100, ps: 70, ea: 90, tref: 450,
    h2: 178, comp: 320, heat: 250, opex: 25, price: 600,
    cats: [
      { n: "Fe (promoted)", act: 1.0, price: 0.1, life: 5, risk: "Low" },
      { n: "Ru / C", act: 2.6, price: 15000, life: 4, risk: "High" },
      { n: "Co-Mo nitride", act: 1.7, price: 35, life: 3, risk: "Medium" },
      { n: "Ni", act: 0.3, price: 15, life: 3, risk: "Low" }
    ]
  },
  methanol: {
    name: "Methanol (CO₂ hydrogenation)", product: "Methanol", pubchem: "methanol", mw: 32.04,
    eq: "CO₂ + 3H₂ ⇌ CH₃OH + H₂O", T: [200, 340, 260], P: [20, 100, 60],
    t50: 260, w: 35, p0: 50, ps: 60, ea: 75, tref: 260,
    h2: 190, comp: 150, heat: 200, opex: 30, price: 450,
    cats: [
      { n: "Cu / ZnO / Al₂O₃", act: 1.0, price: 9, life: 3, risk: "Low" },
      { n: "In₂O₃ / ZrO₂", act: 1.2, price: 250, life: 3, risk: "Medium" },
      { n: "Ni-Ga", act: 1.4, price: 30, life: 2, risk: "Medium" },
      { n: "Pd / ZnO", act: 0.8, price: 50000, life: 3, risk: "High" }
    ]
  },
  methane: {
    name: "Methane (Sabatier)", product: "Methane", pubchem: "methane", mw: 16.04,
    eq: "CO₂ + 4H₂ ⇌ CH₄ + 2H₂O", T: [250, 500, 350], P: [1, 30, 8],
    t50: 560, w: 60, p0: 5, ps: 80, ea: 80, tref: 350,
    h2: 500, comp: 60, heat: 180, opex: 20, price: 700,
    cats: [
      { n: "Ni / Al₂O₃", act: 1.0, price: 15, life: 4, risk: "Low" },
      { n: "Ru / Al₂O₃", act: 2.8, price: 15000, life: 5, risk: "High" },
      { n: "Co / Al₂O₃", act: 0.8, price: 35, life: 3, risk: "Medium" },
      { n: "Fe", act: 0.3, price: 0.1, life: 2, risk: "Low" }
    ]
  }
};
// Grid carbon intensity (kg CO2/kWh) and industrial power price (USD/kWh), rounded
const GRIDS = {
  "India": { ef: 0.71, price: 0.08 }, "China": { ef: 0.55, price: 0.07 },
  "USA": { ef: 0.37, price: 0.11 }, "EU": { ef: 0.21, price: 0.18 },
  "Norway": { ef: 0.03, price: 0.06 }
};
// Hydrogen source: cost USD/kg, kg CO2 per kg H2 (null = depends on grid)
const H2SRC = {
  green: { label: "Renewable electrolysis", cost: 4.0, ef: 1 },
  grey: { label: "Natural gas (SMR)", cost: 1.8, ef: 10 },
  grid: { label: "Grid electrolysis", cost: 2.2, ef: null }
};
