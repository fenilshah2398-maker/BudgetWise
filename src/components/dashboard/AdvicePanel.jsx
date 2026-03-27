import { useSelector } from 'react-redux';
import { generateAdvice, getOptimalBudget } from '../../utils/budgetAdvisor';
import { formatCurrency } from '../../utils/formatCurrency';
import { AlertTriangle, CheckCircle2, Info, XCircle, Lightbulb } from 'lucide-react';

const ICON_MAP = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  danger: XCircle,
};

const STYLE_MAP = {
  success: {
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.03))',
    border: '1px solid rgba(16, 185, 129, 0.18)',
    iconColor: '#34d399',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeColor: '#34d399',
  },
  warning: {
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.03))',
    border: '1px solid rgba(245, 158, 11, 0.18)',
    iconColor: '#fbbf24',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeColor: '#fbbf24',
  },
  info: {
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.03))',
    border: '1px solid rgba(59, 130, 246, 0.18)',
    iconColor: '#60a5fa',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
    badgeColor: '#60a5fa',
  },
  danger: {
    gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08), rgba(225, 29, 72, 0.03))',
    border: '1px solid rgba(244, 63, 94, 0.18)',
    iconColor: '#fb7185',
    badgeBg: 'rgba(244, 63, 94, 0.12)',
    badgeColor: '#fb7185',
  },
};

const OPTIMAL_COLORS = {
  needs: { border: 'rgba(245, 158, 11, 0.2)', bg: 'rgba(245, 158, 11, 0.04)', accent: '#fbbf24' },
  investments: { border: 'rgba(16, 185, 129, 0.2)', bg: 'rgba(16, 185, 129, 0.04)', accent: '#34d399' },
  savings: { border: 'rgba(139, 92, 246, 0.2)', bg: 'rgba(139, 92, 246, 0.04)', accent: '#a78bfa' },
};

function OptimalBudgetCard({ budget }) {
  const optimal = getOptimalBudget(budget.monthlyIncome);
  if (!optimal) return null;

  return (
    <div className="card p-5 sm:p-6 mb-4">
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="p-2 rounded-lg"
          style={{ background: 'rgba(245, 158, 11, 0.12)' }}
        >
          <Lightbulb size={18} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Recommended 50-30-20 Budget</h3>
          <p className="text-[11px] text-slate-500">Optimal split for {formatCurrency(budget.monthlyIncome)}/month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(optimal).map(([key, section]) => {
          const colors = OPTIMAL_COLORS[key];
          return (
            <div
              key={key}
              className="p-4 rounded-xl"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-1">{section.label}</div>
              <div className="text-lg font-bold mb-3" style={{ color: colors.accent }}>
                {formatCurrency(section.amount)}
              </div>
              <div className="space-y-2">
                {Object.entries(section.breakdown).map(([name, amount]) => (
                  <div key={name} className="flex justify-between text-xs">
                    <span className="text-slate-500">{name}</span>
                    <span className="text-slate-400 font-medium tabular-nums">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdvicePanel() {
  const budget = useSelector((s) => s.budget);
  const advice = generateAdvice(budget);

  return (
    <div>
      <OptimalBudgetCard budget={budget} />

      <div className="card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-5 tracking-wide">
          Personalized Financial Advice
          <span className="ml-2 text-[11px] text-slate-500 font-normal">
            {advice.length} insights
          </span>
        </h3>

        <div className="space-y-3">
          {advice.map((item, idx) => {
            const Icon = ICON_MAP[item.type];
            const style = STYLE_MAP[item.type];

            return (
              <div
                key={idx}
                className="p-4 rounded-xl animate-fade-in"
                style={{
                  background: style.gradient,
                  border: style.border,
                  animationDelay: `${idx * 60}ms`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <Icon size={18} style={{ color: style.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1.5">
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider"
                        style={{ background: style.badgeBg, color: style.badgeColor }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-300 mb-1.5 leading-relaxed">{item.message}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.suggestion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
