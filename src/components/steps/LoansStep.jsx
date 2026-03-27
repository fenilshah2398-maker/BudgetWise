import { useDispatch, useSelector } from 'react-redux';
import { setLoans, nextStep, prevStep } from '../../store/budgetSlice';
import CurrencyInput from '../ui/CurrencyInput';
import NavigationButtons from '../ui/NavigationButtons';
import { Landmark } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function LoansStep() {
  const dispatch = useDispatch();
  const loans = useSelector((s) => s.budget.loans);
  const income = useSelector((s) => s.budget.monthlyIncome);

  const total = Object.values(loans).reduce((sum, v) => sum + (v || 0), 0);
  const percentage = income > 0 ? ((total / income) * 100).toFixed(1) : 0;
  const isHigh = percentage > 40;
  const isMod = percentage > 25;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(225,29,72,0.1))',
            border: '1px solid rgba(244,63,94,0.2)',
          }}
        >
          <Landmark className="text-rose-400" size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-1.5">Loan EMIs</h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Monthly EMI amounts. No loans? Skip to next.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total EMIs</div>
          <div className="text-base font-bold text-rose-400">{formatCurrency(total)}</div>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: isHigh ? 'rgba(244,63,94,0.12)' : isMod ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
            color: isHigh ? '#fb7185' : isMod ? '#fbbf24' : '#34d399',
          }}
        >
          {percentage}%
        </span>
      </div>

      <div className="space-y-2">
        <CurrencyInput label="Car Loan EMI" icon="🚗" value={loans.carLoan} onChange={(val) => dispatch(setLoans({ carLoan: val }))} compact />
        <CurrencyInput label="Personal Loan EMI" icon="💳" value={loans.personalLoan} onChange={(val) => dispatch(setLoans({ personalLoan: val }))} compact />
        <CurrencyInput label="Home Loan EMI" icon="🏠" value={loans.homeLoan} onChange={(val) => dispatch(setLoans({ homeLoan: val }))} compact />
        <CurrencyInput label="Extra Home Loan Payment" icon="⚡" value={loans.extraHomeLoanPayment} onChange={(val) => dispatch(setLoans({ extraHomeLoanPayment: val }))} compact />
      </div>

      {loans.homeLoan > 0 && !loans.extraHomeLoanPayment && (
        <div
          className="mt-3 p-2.5 rounded-lg text-[11px] leading-relaxed"
          style={{
            background: 'rgba(245,158,11,0.05)',
            border: '1px solid rgba(245,158,11,0.12)',
            color: '#fbbf24',
          }}
        >
          💡 Paying 10% extra on your home loan EMI can reduce tenure by 3-5 years.
        </div>
      )}

      <NavigationButtons
        onPrev={() => dispatch(prevStep())}
        onNext={() => dispatch(nextStep())}
      />
    </div>
  );
}
