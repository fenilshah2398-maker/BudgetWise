import { formatNumber } from '../../utils/formatCurrency';

export default function CurrencyInput({ label, value, onChange, icon, subtitle, placeholder = '0', compact = false }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    onChange(Number(raw) || 0);
  };

  if (compact) {
    return (
      <div className="group flex items-center gap-2">
        <label className="flex items-center gap-1 text-xs text-slate-500 min-w-0 flex-1 truncate">
          {icon && <span className="text-xs shrink-0">{icon}</span>}
          <span className="truncate">{label}</span>
        </label>
        <div className="relative w-28 shrink-0">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 font-medium text-[11px] pointer-events-none">₹</span>
          <input
            type="text"
            inputMode="numeric"
            value={value ? formatNumber(value) : ''}
            onChange={handleChange}
            placeholder={placeholder}
            className="input-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <label className="flex items-center gap-1 text-xs font-medium text-slate-400 mb-1 transition-colors group-focus-within:text-blue-400">
        {icon && <span className="text-sm leading-none">{icon}</span>}
        <span>{label}</span>
      </label>
      {subtitle && (
        <p className="text-[10px] text-slate-600 mb-1.5">{subtitle}</p>
      )}
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-xs pointer-events-none">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={value ? formatNumber(value) : ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="input-field"
        />
      </div>
    </div>
  );
}
