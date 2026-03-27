import { useDispatch, useSelector } from 'react-redux';
import { resetBudget, editBudget } from '../../store/budgetSlice';
import { clearStorage } from '../../utils/storage';
import OverviewCards from './OverviewCards';
import BudgetCharts from './BudgetCharts';
import AdvicePanel from './AdvicePanel';
import { RotateCcw, Download, Pencil } from 'lucide-react';

const STEP_LABELS = ['Income', 'Investments', 'Loans', 'Expenses', 'Savings'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const budget = useSelector((s) => s.budget);

  const handleReset = () => {
    if (window.confirm('This will clear all your budget data. Are you sure?')) {
      clearStorage();
      dispatch(resetBudget());
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(budget, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budgetwise-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Your Budget Dashboard
          </h2>
          <p className="text-slate-500 text-sm mt-1">Personalized financial overview and recommendations</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button onClick={() => dispatch(editBudget(0))} className="btn-ghost text-xs">
            <Pencil size={13} />
            Edit Budget
          </button>
          <button onClick={handleExport} className="btn-ghost text-xs">
            <Download size={13} />
            Export
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200"
            style={{
              color: '#fb7185',
              background: 'rgba(244,63,94,0.06)',
              border: '1px solid rgba(244,63,94,0.15)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.06)'; }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {STEP_LABELS.map((label, idx) => (
          <button
            key={idx}
            onClick={() => dispatch(editBudget(idx))}
            className="px-2.5 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-all"
            style={{
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.12)',
              color: '#60a5fa',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; }}
          >
            Change {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <OverviewCards />
        <BudgetCharts />
        <AdvicePanel />
      </div>
    </div>
  );
}
