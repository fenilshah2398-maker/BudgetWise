import { useSelector } from 'react-redux';
import BudgetWizard from './components/BudgetWizard';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  const isComplete = useSelector((s) => s.budget.isComplete);

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="bg-noise" />

      {isComplete ? (
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <Dashboard />
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6">
          <div className="w-full max-w-2xl">
            <BudgetWizard />
          </div>
        </main>
      )}

      <footer className="text-center py-4 border-t border-slate-800/30">
        <p className="text-[10px] text-slate-700 tracking-wide">
          BudgetWise &middot; Your data stays in your browser. Always private.
        </p>
      </footer>
    </div>
  );
}
