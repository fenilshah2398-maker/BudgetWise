import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Income', icon: '💰' },
  { label: 'Investments', icon: '📈' },
  { label: 'Loans', icon: '🏦' },
  { label: 'Expenses', icon: '🧾' },
  { label: 'Savings', icon: '🎯' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;

        return (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                style={{
                  background: isCompleted
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15))'
                    : isActive
                      ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.15))'
                      : 'rgba(30,41,59,0.6)',
                  border: isCompleted
                    ? '2px solid rgba(16,185,129,0.5)'
                    : isActive
                      ? '2px solid rgba(59,130,246,0.5)'
                      : '1.5px solid rgba(51,65,85,0.4)',
                  boxShadow: isActive ? '0 0 12px rgba(59,130,246,0.15)' : 'none',
                }}
              >
                {isCompleted ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <span className={`text-xs ${isActive ? '' : 'grayscale opacity-50'}`}>
                    {step.icon}
                  </span>
                )}
              </div>
              <span
                className="text-[9px] sm:text-[10px] font-medium tracking-wide"
                style={{ color: isActive ? '#60a5fa' : isCompleted ? '#34d399' : '#475569' }}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className="w-6 sm:w-10 lg:w-14 h-[1.5px] mx-1.5 sm:mx-2 rounded-full transition-all duration-500 -mt-4"
                style={{
                  background: idx < currentStep
                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : 'rgba(51,65,85,0.35)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
