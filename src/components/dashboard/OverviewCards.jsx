import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/formatCurrency';
import { getAllInvestmentsTotal } from '../../utils/investmentHelpers';
import { TrendingUp, Landmark, Receipt, Target, Wallet, PiggyBank } from 'lucide-react';

const CARD_STYLES = {
  primary: {
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(37,99,235,0.06))',
    border: '1px solid rgba(59,130,246,0.2)',
    iconBg: 'rgba(59,130,246,0.15)',
    color: '#60a5fa',
  },
  emerald: {
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))',
    border: '1px solid rgba(16,185,129,0.2)',
    iconBg: 'rgba(16,185,129,0.15)',
    color: '#34d399',
  },
  rose: {
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(225,29,72,0.06))',
    border: '1px solid rgba(244,63,94,0.2)',
    iconBg: 'rgba(244,63,94,0.15)',
    color: '#fb7185',
  },
  amber: {
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.06))',
    border: '1px solid rgba(245,158,11,0.2)',
    iconBg: 'rgba(245,158,11,0.15)',
    color: '#fbbf24',
  },
  violet: {
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(124,58,237,0.06))',
    border: '1px solid rgba(139,92,246,0.2)',
    iconBg: 'rgba(139,92,246,0.15)',
    color: '#a78bfa',
  },
};

export default function OverviewCards() {
  const budget = useSelector((s) => s.budget);
  const { monthlyIncome, investments, loans, expenses, savings } = budget;

  const totalInvestments = getAllInvestmentsTotal(investments);
  const totalLoans = Object.values(loans).reduce((s, v) => s + (v || 0), 0);
  const totalSavings = Object.values(savings).reduce((s, v) => s + (v || 0), 0);
  const totalOutflow = totalInvestments + totalLoans + (expenses.monthly || 0) + totalSavings;
  const remaining = monthlyIncome - totalOutflow;

  const cards = [
    { label: 'Monthly Income', value: monthlyIncome, icon: Wallet, theme: 'primary' },
    {
      label: 'Investments', value: totalInvestments, icon: TrendingUp, theme: 'emerald',
      pct: monthlyIncome > 0 ? ((totalInvestments / monthlyIncome) * 100).toFixed(1) : 0,
    },
    {
      label: 'Loan EMIs', value: totalLoans, icon: Landmark, theme: 'rose',
      pct: monthlyIncome > 0 ? ((totalLoans / monthlyIncome) * 100).toFixed(1) : 0,
    },
    {
      label: 'Expenses', value: expenses.monthly || 0, icon: Receipt, theme: 'amber',
      pct: monthlyIncome > 0 ? (((expenses.monthly || 0) / monthlyIncome) * 100).toFixed(1) : 0,
    },
    {
      label: 'Savings', value: totalSavings, icon: Target, theme: 'violet',
      pct: monthlyIncome > 0 ? ((totalSavings / monthlyIncome) * 100).toFixed(1) : 0,
    },
    {
      label: remaining >= 0 ? 'Unallocated' : 'Deficit',
      value: Math.abs(remaining), icon: PiggyBank,
      theme: remaining >= 0 ? 'emerald' : 'rose',
      pct: monthlyIncome > 0 ? ((Math.abs(remaining) / monthlyIncome) * 100).toFixed(1) : 0,
      prefix: remaining < 0 ? '-' : '',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const style = CARD_STYLES[card.theme];
        return (
          <div
            key={idx}
            className={`relative overflow-hidden p-4 sm:p-5 rounded-2xl transition-transform duration-200 hover:scale-[1.02] cursor-default animate-scale-in stagger-${idx + 1}`}
            style={{ background: style.gradient, border: style.border }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl" style={{ background: style.iconBg }}>
                <Icon size={18} style={{ color: style.color }} />
              </div>
              {card.pct !== undefined && (
                <span className="text-xs font-bold opacity-80" style={{ color: style.color }}>{card.pct}%</span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: style.color }}>
              {card.prefix}{formatCurrency(card.value)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
}
