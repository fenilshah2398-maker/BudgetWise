import { useDispatch, useSelector } from 'react-redux';
import { setMonthlyIncome, nextStep } from '../../store/budgetSlice';
import CurrencyInput from '../ui/CurrencyInput';
import NavigationButtons from '../ui/NavigationButtons';
import { Wallet } from 'lucide-react';

export default function IncomeStep() {
  const dispatch = useDispatch();
  const income = useSelector((s) => s.budget.monthlyIncome);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.1))',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
        >
          <Wallet className="text-blue-400" size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-1.5">What's your monthly income?</h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Enter your total monthly take-home salary (after tax deductions).
        </p>
      </div>

      <div className="max-w-xs mx-auto">
        <CurrencyInput
          label="Monthly Take-Home Income"
          value={income}
          onChange={(val) => dispatch(setMonthlyIncome(val))}
          placeholder="e.g. 75,000"
        />

        {income > 0 && (
          <div
            className="mt-4 p-3 rounded-lg animate-scale-in text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(37,99,235,0.04))',
              border: '1px solid rgba(59,130,246,0.15)',
            }}
          >
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Annual Income</div>
            <div className="text-lg font-bold text-blue-400">
              ₹{(income * 12).toLocaleString('en-IN')}
            </div>
          </div>
        )}
      </div>

      <NavigationButtons
        isFirst
        onNext={() => income > 0 && dispatch(nextStep())}
      />
    </div>
  );
}
