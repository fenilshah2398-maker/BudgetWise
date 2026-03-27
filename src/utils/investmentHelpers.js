const makeCategory = () => ({ total: 0, items: [] });

export const defaultInvestments = () => ({
  mutualFund: makeCategory(),
  mediclaim: makeCategory(),
  nps: makeCategory(),
  pf: makeCategory(),
  lic: makeCategory(),
  lifeInsurance: makeCategory(),
  stocks: makeCategory(),
  gold: makeCategory(),
  silver: makeCategory(),
});

export const getCatTotal = (cat) => {
  if (!cat) return 0;
  if (typeof cat === 'number') return cat;
  if (cat.items && cat.items.length > 0) {
    return cat.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
  return cat.total || 0;
};

export const getAllInvestmentsTotal = (investments) => {
  if (!investments) return 0;
  return Object.values(investments).reduce((sum, cat) => sum + getCatTotal(cat), 0);
};

export const getDetailedBreakdown = (investments) => {
  const CATEGORY_COLORS = {
    mutualFund: '#3b82f6',
    mediclaim: '#10b981',
    nps: '#8b5cf6',
    pf: '#f59e0b',
    lic: '#ef4444',
    lifeInsurance: '#06b6d4',
    stocks: '#ec4899',
    gold: '#eab308',
    silver: '#94a3b8',
  };

  const CATEGORY_LABELS = {
    mutualFund: 'Mutual Fund',
    mediclaim: 'Mediclaim',
    nps: 'NPS',
    pf: 'PF',
    lic: 'LIC',
    lifeInsurance: 'Life Insurance',
    stocks: 'Stocks',
    gold: 'Gold',
    silver: 'Silver',
  };

  const categoryBars = [];
  const detailedItems = [];

  const SUB_COLORS = [
    '#60a5fa', '#34d399', '#a78bfa', '#fbbf24', '#fb7185',
    '#38bdf8', '#4ade80', '#c084fc', '#fcd34d', '#f472b6',
    '#22d3ee', '#86efac', '#e879f9', '#fde68a', '#f9a8d4',
  ];
  let colorIdx = 0;

  for (const [key, cat] of Object.entries(investments)) {
    const total = getCatTotal(cat);
    if (total <= 0) continue;

    categoryBars.push({
      name: CATEGORY_LABELS[key] || key,
      value: total,
      color: CATEGORY_COLORS[key] || '#64748b',
    });

    if (cat && cat.items && cat.items.length > 0) {
      for (const item of cat.items) {
        if (item.amount > 0) {
          detailedItems.push({
            name: `${item.name}`,
            category: CATEGORY_LABELS[key],
            value: item.amount,
            color: SUB_COLORS[colorIdx % SUB_COLORS.length],
          });
          colorIdx++;
        }
      }
    } else {
      detailedItems.push({
        name: CATEGORY_LABELS[key] || key,
        category: CATEGORY_LABELS[key],
        value: total,
        color: CATEGORY_COLORS[key] || '#64748b',
      });
      colorIdx++;
    }
  }

  return { categoryBars, detailedItems };
};

export const migrateInvestments = (investments) => {
  if (!investments) return defaultInvestments();

  const result = {};
  for (const [key, val] of Object.entries(investments)) {
    if (typeof val === 'number') {
      result[key] = { total: val, items: [] };
    } else if (val && typeof val === 'object') {
      result[key] = {
        total: val.total || 0,
        items: Array.isArray(val.items) ? val.items : [],
      };
    } else {
      result[key] = { total: 0, items: [] };
    }
  }

  for (const key of Object.keys(defaultInvestments())) {
    if (!result[key]) result[key] = { total: 0, items: [] };
  }

  return result;
};
