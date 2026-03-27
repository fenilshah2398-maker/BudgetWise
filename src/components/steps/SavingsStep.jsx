import { useDispatch, useSelector } from 'react-redux';
import { setSavings, prevStep, setComplete } from '../../store/budgetSlice';
import CurrencyInput from '../ui/CurrencyInput';
import NavigationButtons from '../ui/NavigationButtons';
import { Target } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function SavingsStep() {
  const dispatch = useDispatch();
  const savings = useSelector((s) => s.budget.savings);
  const income = useSelector((s) => s.budget.monthlyIncome);

  const total = Object.values(savings).reduce((sum, v) => sum + (v || 0), 0);
  const percentage = income > 0 ? ((total / income) * 100).toFixed(1) : 0;
  const yearlyTour = (savings.tourBudget || 0) * 12;
  const isGood = percentage >= 20;
  const isOk = percentage >= 10;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(124,58,237,0.1))',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <Target className="text-violet-400" size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-1.5">Savings & Goals</h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Plan for vacations, emergencies, and future goals.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Savings</div>
          <div className="text-base font-bold text-violet-400">{formatCurrency(total)}</div>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: isGood ? 'rgba(16,185,129,0.12)' : isOk ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)',
            color: isGood ? '#34d399' : isOk ? '#fbbf24' : '#fb7185',
          }}
        >
          {percentage}%
        </span>
      </div>

      <div className="space-y-2">
        <CurrencyInput label="Tour / Vacation" icon="✈️" value={savings.tourBudget} onChange={(val) => dispatch(setSavings({ tourBudget: val }))} compact />
        {savings.tourBudget > 0 && (
          <p className="text-[10px] text-slate-600 pl-1 -mt-0.5">
            Yearly: <span className="text-emerald-400 font-semibold">{formatCurrency(yearlyTour)}</span>
          </p>
        )}
        <CurrencyInput label="Emergency Fund" icon="🆘" value={savings.emergencyFund} onChange={(val) => dispatch(setSavings({ emergencyFund: val }))} compact />
        <CurrencyInput label="Extra Savings" icon="✨" value={savings.extraSavings} onChange={(val) => dispatch(setSavings({ extraSavings: val }))} compact />
      </div>

      <NavigationButtons
        onPrev={() => dispatch(prevStep())}
        isLast
        onFinish={() => dispatch(setComplete())}
      />
    </div>
  );
}
