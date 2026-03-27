import { useDispatch, useSelector } from 'react-redux';
import { setExpenses, nextStep, prevStep } from '../../store/budgetSlice';
import CurrencyInput from '../ui/CurrencyInput';
import NavigationButtons from '../ui/NavigationButtons';
import { Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ExpensesStep() {
  const dispatch = useDispatch();
  const expenses = useSelector((s) => s.budget.expenses);
  const income = useSelector((s) => s.budget.monthlyIncome);

  const percentage = income > 0 ? ((expenses.monthly / income) * 100).toFixed(1) : 0;
  const isHigh = percentage > 50;
  const isMod = percentage > 35;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <Receipt className="text-amber-400" size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-1.5">Monthly Expenses</h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Rent, groceries, utilities, transport, food, subscriptions — all regular spending.
        </p>
      </div>

      <div className="max-w-xs mx-auto">
        <CurrencyInput
          label="Total Monthly Expenses"
          icon="🧾"
          value={expenses.monthly}
          onChange={(val) => dispatch(setExpenses({ monthly: val }))}
          placeholder="e.g. 25,000"
        />

        {expenses.monthly > 0 && (
          <div className="mt-4 space-y-2.5 animate-scale-in">
            <div className="card-inner p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-slate-500 font-medium">Expense Ratio</span>
                <span className="text-xs font-bold" style={{ color: isHigh ? '#fb7185' : isMod ? '#fbbf24' : '#34d399' }}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    background: isHigh ? 'linear-gradient(90deg, #f43f5e, #fb7185)' : isMod ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #10b981, #34d399)',
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-600 mt-1.5">
                {isHigh ? 'Above 50% — consider reducing' : isMod ? 'Moderate — some room to optimize' : 'Well controlled!'}
              </p>
            </div>

            <div
              className="p-3 rounded-lg text-center"
              style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.12)',
              }}
            >
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Annual</div>
              <div className="text-base font-bold text-blue-400">{formatCurrency(expenses.monthly * 12)}</div>
            </div>
          </div>
        )}
      </div>

      <NavigationButtons
        onPrev={() => dispatch(prevStep())}
        onNext={() => dispatch(nextStep())}
      />
    </div>
  );
}
