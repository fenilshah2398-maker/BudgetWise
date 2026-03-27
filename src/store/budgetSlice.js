import { createSlice } from '@reduxjs/toolkit';
import { defaultInvestments, migrateInvestments } from '../utils/investmentHelpers';

const initialState = {
  currentStep: 0,
  isComplete: false,
  monthlyIncome: 0,
  investments: defaultInvestments(),
  loans: {
    carLoan: 0,
    personalLoan: 0,
    homeLoan: 0,
    extraHomeLoanPayment: 0,
  },
  expenses: {
    monthly: 0,
  },
  savings: {
    tourBudget: 0,
    emergencyFund: 0,
    extraSavings: 0,
  },
};

let nextItemId = 1;

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setMonthlyIncome: (state, action) => {
      state.monthlyIncome = Number(action.payload) || 0;
    },
    setCategoryTotal: (state, action) => {
      const { category, total } = action.payload;
      if (state.investments[category]) {
        state.investments[category].total = total;
        state.investments[category].items = [];
      }
    },
    addCategoryItem: (state, action) => {
      const { category, name, amount } = action.payload;
      if (state.investments[category]) {
        state.investments[category].items.push({
          id: `item_${nextItemId++}`,
          name,
          amount: Number(amount) || 0,
        });
      }
    },
    updateCategoryItem: (state, action) => {
      const { category, itemId, name, amount } = action.payload;
      const cat = state.investments[category];
      if (cat) {
        const item = cat.items.find((i) => i.id === itemId);
        if (item) {
          if (name !== undefined) item.name = name;
          if (amount !== undefined) item.amount = Number(amount) || 0;
        }
      }
    },
    removeCategoryItem: (state, action) => {
      const { category, itemId } = action.payload;
      if (state.investments[category]) {
        state.investments[category].items = state.investments[category].items.filter(
          (i) => i.id !== itemId
        );
      }
    },
    setLoans: (state, action) => {
      state.loans = { ...state.loans, ...action.payload };
    },
    setExpenses: (state, action) => {
      state.expenses = { ...state.expenses, ...action.payload };
    },
    setSavings: (state, action) => {
      state.savings = { ...state.savings, ...action.payload };
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep = Math.min(state.currentStep + 1, 5);
    },
    prevStep: (state) => {
      state.currentStep = Math.max(state.currentStep - 1, 0);
    },
    setComplete: (state) => {
      state.isComplete = true;
    },
    editBudget: (state, action) => {
      state.isComplete = false;
      if (action.payload !== undefined) {
        state.currentStep = action.payload;
      }
    },
    resetBudget: () => initialState,
    loadState: (_, action) => {
      const loaded = { ...action.payload };
      loaded.investments = migrateInvestments(loaded.investments);
      return loaded;
    },
  },
});

export const {
  setMonthlyIncome,
  setCategoryTotal,
  addCategoryItem,
  updateCategoryItem,
  removeCategoryItem,
  setLoans,
  setExpenses,
  setSavings,
  setCurrentStep,
  nextStep,
  prevStep,
  setComplete,
  editBudget,
  resetBudget,
  loadState,
} = budgetSlice.actions;

export default budgetSlice.reducer;
