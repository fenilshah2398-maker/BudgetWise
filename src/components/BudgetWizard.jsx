import { useSelector } from 'react-redux';
import StepIndicator from './ui/StepIndicator';
import IncomeStep from './steps/IncomeStep';
import InvestmentsStep from './steps/InvestmentsStep';
import LoansStep from './steps/LoansStep';
import ExpensesStep from './steps/ExpensesStep';
import SavingsStep from './steps/SavingsStep';

const STEP_COMPONENTS = [
  IncomeStep,
  InvestmentsStep,
  LoansStep,
  ExpensesStep,
  SavingsStep,
];

export default function BudgetWizard() {
  const currentStep = useSelector((s) => s.budget.currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-5">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            BudgetWise
          </span>
        </h1>
        <p className="text-slate-600 text-xs mt-1.5 tracking-wide">Smart Budget Planner</p>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div className="mt-5">
        <div className="card-glow p-5 sm:p-6">
          <StepComponent />
        </div>
      </div>
    </div>
  );
}
