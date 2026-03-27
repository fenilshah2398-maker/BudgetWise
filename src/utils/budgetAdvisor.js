import { getCatTotal, getAllInvestmentsTotal, getDetailedBreakdown } from './investmentHelpers';

export const IDEAL_RATIOS = {
  needs: 0.50,
  investments: 0.30,
  savings: 0.20,
};

export const generateAdvice = (budgetData) => {
  const { monthlyIncome, investments, loans, expenses, savings } = budgetData;
  if (!monthlyIncome || monthlyIncome <= 0) return [];

  const advice = [];
  const income = monthlyIncome;

  const totalInvestments = getAllInvestmentsTotal(investments);
  const totalLoans =
    (loans.carLoan || 0) + (loans.personalLoan || 0) +
    (loans.homeLoan || 0) + (loans.extraHomeLoanPayment || 0);
  const totalExpenses = expenses.monthly || 0;
  const totalSavings =
    (savings.tourBudget || 0) + (savings.emergencyFund || 0) + (savings.extraSavings || 0);

  const totalOutflow = totalInvestments + totalLoans + totalExpenses + totalSavings;
  const remaining = income - totalOutflow;

  const investmentRatio = totalInvestments / income;
  const loanRatio = totalLoans / income;
  const expenseRatio = totalExpenses / income;

  if (investmentRatio < 0.20) {
    advice.push({
      type: 'warning',
      category: 'Investments',
      message: `You're investing only ${(investmentRatio * 100).toFixed(1)}% of your income. Aim for at least 20-30%.`,
      suggestion: `Consider increasing SIP by ₹${Math.round((0.25 * income - totalInvestments) / 100) * 100}/month.`,
    });
  } else if (investmentRatio >= 0.30) {
    advice.push({
      type: 'success',
      category: 'Investments',
      message: `Great! Investing ${(investmentRatio * 100).toFixed(1)}% of income. Excellent for wealth creation.`,
      suggestion: 'Review your portfolio quarterly for rebalancing.',
    });
  } else {
    advice.push({
      type: 'info',
      category: 'Investments',
      message: `Investing ${(investmentRatio * 100).toFixed(1)}% — good, but room for improvement.`,
      suggestion: 'Consider diversifying into index funds or NPS for tax benefits.',
    });
  }

  if (loanRatio > 0.40) {
    advice.push({
      type: 'danger',
      category: 'Loans',
      message: `EMIs consume ${(loanRatio * 100).toFixed(1)}% of income. Dangerously high!`,
      suggestion: 'Prioritize paying off high-interest loans first. Consider debt consolidation.',
    });
  } else if (loanRatio > 0.25) {
    advice.push({
      type: 'warning',
      category: 'Loans',
      message: `EMIs take ${(loanRatio * 100).toFixed(1)}% of income. Try to bring below 25%.`,
      suggestion: 'Make extra payments on the highest interest-rate loan first.',
    });
  } else if (totalLoans > 0) {
    advice.push({
      type: 'info',
      category: 'Loans',
      message: `EMIs are ${(loanRatio * 100).toFixed(1)}% of income — manageable.`,
      suggestion: 'Keep regular payments and avoid taking on additional debt.',
    });
  }

  if (expenseRatio > 0.50) {
    advice.push({
      type: 'warning',
      category: 'Expenses',
      message: `Expenses are ${(expenseRatio * 100).toFixed(1)}% of income. Try the 50-30-20 rule.`,
      suggestion: 'Track expenses for a month, reduce subscriptions or dining by 10-15%.',
    });
  } else {
    advice.push({
      type: 'success',
      category: 'Expenses',
      message: `Expenses are ${(expenseRatio * 100).toFixed(1)}% of income — well controlled.`,
      suggestion: 'Maintain this discipline. Automate bill payments to avoid late fees.',
    });
  }

  if (!savings.emergencyFund || savings.emergencyFund < income * 0.05) {
    advice.push({
      type: 'danger',
      category: 'Emergency Fund',
      message: 'Emergency fund contribution is very low or missing!',
      suggestion: `Build 6 months' expenses (₹${(totalExpenses * 6).toLocaleString('en-IN')}). Save at least ₹${Math.round(income * 0.05).toLocaleString('en-IN')}/month.`,
    });
  } else {
    advice.push({
      type: 'success',
      category: 'Emergency Fund',
      message: `Saving ₹${savings.emergencyFund.toLocaleString('en-IN')}/month for emergencies.`,
      suggestion: 'Keep in a liquid fund or high-yield savings account.',
    });
  }

  if (!savings.tourBudget || savings.tourBudget === 0) {
    advice.push({
      type: 'info',
      category: 'Tour Budget',
      message: 'No travel budget allocated.',
      suggestion: `Set aside ₹${Math.round(income * 0.03).toLocaleString('en-IN')}/month for vacations.`,
    });
  }

  const npsTotal = getCatTotal(investments.nps);
  const pfTotal = getCatTotal(investments.pf);
  if (npsTotal === 0 && pfTotal === 0) {
    advice.push({
      type: 'warning',
      category: 'Retirement',
      message: 'No NPS or PF contributions found.',
      suggestion: 'Start NPS with ₹5,000/month for extra tax deduction under 80CCD(1B).',
    });
  }

  const mediclaimTotal = getCatTotal(investments.mediclaim);
  if (mediclaimTotal === 0) {
    advice.push({
      type: 'danger',
      category: 'Health Insurance',
      message: 'No health insurance premium found!',
      suggestion: 'Get at least ₹10L cover. Premium ₹8K-15K/year is deductible under 80D.',
    });
  }

  if (remaining < 0) {
    advice.push({
      type: 'danger',
      category: 'Budget Deficit',
      message: `Spending ₹${Math.abs(remaining).toLocaleString('en-IN')} more than income!`,
      suggestion: 'Cut discretionary expenses or increase income through side projects.',
    });
  } else if (remaining > income * 0.10) {
    advice.push({
      type: 'info',
      category: 'Unallocated Funds',
      message: `₹${remaining.toLocaleString('en-IN')} (${(remaining / income * 100).toFixed(1)}%) unallocated.`,
      suggestion: 'Direct this to mutual fund SIPs or emergency fund.',
    });
  }

  if (loans.homeLoan > 0 && (!loans.extraHomeLoanPayment || loans.extraHomeLoanPayment === 0)) {
    advice.push({
      type: 'info',
      category: 'Home Loan',
      message: 'Extra home loan payments can save years of interest.',
      suggestion: `Even ₹${Math.round(loans.homeLoan * 0.1).toLocaleString('en-IN')} extra/month reduces tenure by 3-5 years.`,
    });
  }

  return advice;
};

export const getOptimalBudget = (income) => {
  if (!income || income <= 0) return null;
  return {
    needs: {
      label: 'Needs (50%)',
      amount: income * 0.50,
      breakdown: {
        'Monthly Expenses': income * 0.35,
        'Loan EMIs': income * 0.15,
      },
    },
    investments: {
      label: 'Investments (30%)',
      amount: income * 0.30,
      breakdown: {
        'Mutual Funds/SIP': income * 0.12,
        'PF/NPS': income * 0.08,
        'Stocks': income * 0.05,
        'Gold/Silver': income * 0.02,
        'Insurance': income * 0.03,
      },
    },
    savings: {
      label: 'Savings (20%)',
      amount: income * 0.20,
      breakdown: {
        'Emergency Fund': income * 0.08,
        'Tour/Vacation': income * 0.04,
        'Extra Savings': income * 0.08,
      },
    },
  };
};

export const getCategoryBreakdown = (budgetData) => {
  const { investments, loans, savings } = budgetData;
  const { categoryBars, detailedItems } = getDetailedBreakdown(investments);

  return {
    investmentCategories: categoryBars,
    investmentDetails: detailedItems,
    loans: [
      { name: 'Car Loan', value: loans.carLoan || 0, color: '#f43f5e' },
      { name: 'Personal Loan', value: loans.personalLoan || 0, color: '#f97316' },
      { name: 'Home Loan', value: loans.homeLoan || 0, color: '#a855f7' },
      { name: 'Extra Home Loan', value: loans.extraHomeLoanPayment || 0, color: '#6366f1' },
    ].filter(i => i.value > 0),
    savings: [
      { name: 'Tour Budget', value: savings.tourBudget || 0, color: '#14b8a6' },
      { name: 'Emergency Fund', value: savings.emergencyFund || 0, color: '#f59e0b' },
      { name: 'Extra Savings', value: savings.extraSavings || 0, color: '#8b5cf6' },
    ].filter(i => i.value > 0),
  };
};
