import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCategoryTotal, addCategoryItem,
  updateCategoryItem, removeCategoryItem,
  nextStep, prevStep,
} from '../../store/budgetSlice';
import NavigationButtons from '../ui/NavigationButtons';
import { TrendingUp, Plus, X, ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import { getCatTotal, getAllInvestmentsTotal } from '../../utils/investmentHelpers';

const CATEGORIES = [
  { key: 'mutualFund', label: 'Mutual Fund / SIP', icon: '📊', hint: 'Axis Bluechip' },
  { key: 'mediclaim', label: 'Mediclaim', icon: '🏥', hint: 'Star Health' },
  { key: 'nps', label: 'NPS', icon: '🏛️', hint: 'SBI NPS Tier 1' },
  { key: 'pf', label: 'Provident Fund', icon: '🔒', hint: 'EPF' },
  { key: 'lic', label: 'LIC', icon: '📋', hint: 'Jeevan Anand' },
  { key: 'lifeInsurance', label: 'Life Insurance', icon: '🛡️', hint: 'ICICI iProtect' },
  { key: 'stocks', label: 'Stocks / Equity', icon: '📈', hint: 'Reliance' },
  { key: 'gold', label: 'Gold', icon: '🥇', hint: 'SGB' },
  { key: 'silver', label: 'Silver', icon: '🥈', hint: 'Silver ETF' },
];

function FundItem({ item, catKey, dispatch }) {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(item.name);

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    dispatch(updateCategoryItem({ category: catKey, itemId: item.id, amount: Number(raw) || 0 }));
  };

  const commitName = () => {
    if (tempName.trim() && tempName !== item.name) {
      dispatch(updateCategoryItem({ category: catKey, itemId: item.id, name: tempName.trim() }));
    }
    setEditingName(false);
  };

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md group"
      style={{ background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(51,65,85,0.25)' }}
    >
      {editingName ? (
        <input
          autoFocus
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => e.key === 'Enter' && commitName()}
          className="flex-1 min-w-0 bg-transparent text-[11px] text-slate-200 outline-none border-b border-blue-500/40 pb-0.5"
        />
      ) : (
        <span
          onClick={() => setEditingName(true)}
          className="flex-1 min-w-0 text-[11px] text-slate-300 truncate cursor-pointer hover:text-blue-400 transition-colors"
          title={`Click to rename: ${item.name}`}
        >
          {item.name}
        </span>
      )}

      <div className="relative w-20 shrink-0">
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-medium pointer-events-none">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={item.amount ? formatNumber(item.amount) : ''}
          onChange={handleAmountChange}
          placeholder="0"
          className="w-full py-1 pl-4 pr-1 bg-slate-900/40 border border-slate-700/30 rounded text-[11px] text-slate-100 font-medium outline-none focus:border-blue-500/40 transition-colors"
        />
      </div>

      <button
        type="button"
        onClick={() => dispatch(removeCategoryItem({ category: catKey, itemId: item.id }))}
        className="p-0.5 rounded text-slate-700 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
      >
        <X size={11} />
      </button>
    </div>
  );
}

function CategoryRow({ catDef, catData, dispatch }) {
  const [expanded, setExpanded] = useState(catData.items.length > 0 || getCatTotal(catData) > 0);
  const [useDetailed, setUseDetailed] = useState(catData.items.length > 0);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const total = getCatTotal(catData);

  const handleTotalChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    dispatch(setCategoryTotal({ category: catDef.key, total: Number(raw) || 0 }));
  };

  const handleAddItem = () => {
    const name = newName.trim() || catDef.label;
    const amount = Number(newAmount.replace(/[^0-9]/g, '')) || 0;
    dispatch(addCategoryItem({ category: catDef.key, name, amount }));
    setNewName('');
    setNewAmount('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddItem();
  };

  const switchToDetailed = () => {
    setUseDetailed(true);
    if (catData.total > 0 && catData.items.length === 0) {
      dispatch(setCategoryTotal({ category: catDef.key, total: 0 }));
    }
  };

  const switchToTotal = () => {
    setUseDetailed(false);
    const currentTotal = getCatTotal(catData);
    dispatch(setCategoryTotal({ category: catDef.key, total: currentTotal }));
  };

  return (
    <div
      className="rounded-lg transition-all"
      style={{
        background: expanded ? 'rgba(15,23,42,0.35)' : 'transparent',
        border: expanded ? '1px solid rgba(51,65,85,0.25)' : '1px solid transparent',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-slate-800/20 transition-colors rounded-lg"
      >
        <span className="text-sm leading-none">{catDef.icon}</span>
        <span className="text-[12px] font-medium text-slate-300 flex-1">{catDef.label}</span>
        {total > 0 && (
          <span className="text-[11px] font-bold text-emerald-400 tabular-nums">{formatCurrency(total)}</span>
        )}
        {catData.items.length > 0 && (
          <span
            className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}
          >
            {catData.items.length}
          </span>
        )}
        <span className="text-slate-700 ml-0.5">
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-0.5 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="toggle-group">
              <button type="button" className={`toggle-btn ${!useDetailed ? 'active' : ''}`} onClick={switchToTotal}>
                Total
              </button>
              <button type="button" className={`toggle-btn ${useDetailed ? 'active' : ''}`} onClick={switchToDetailed}>
                Add Funds
              </button>
            </div>
            {useDetailed && total > 0 && (
              <span className="text-[10px] text-slate-600">Total: {formatCurrency(total)}</span>
            )}
          </div>

          {!useDetailed ? (
            <div className="relative max-w-[180px]">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 text-[11px] font-medium pointer-events-none">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={catData.total ? formatNumber(catData.total) : ''}
                onChange={handleTotalChange}
                placeholder="0"
                className="input-sm"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              {catData.items.map((item) => (
                <FundItem key={item.id} item={item} catKey={catDef.key} dispatch={dispatch} />
              ))}

              <div
                className="flex items-center gap-1.5 p-1.5 rounded-md"
                style={{ background: 'rgba(59,130,246,0.04)', border: '1px dashed rgba(59,130,246,0.15)' }}
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={catDef.hint}
                  className="flex-1 min-w-0 px-2 py-1 rounded bg-transparent text-[11px] text-slate-300 placeholder:text-slate-700 outline-none"
                />
                <div className="relative w-20 shrink-0">
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] pointer-events-none">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyDown={handleKeyDown}
                    placeholder="Amount"
                    className="w-full py-1 pl-4 pr-1 bg-slate-900/30 border border-slate-800/30 rounded text-[11px] text-slate-100 placeholder:text-slate-700 outline-none focus:border-blue-500/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center justify-center w-6 h-6 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors cursor-pointer shrink-0"
                  title="Add fund"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InvestmentsStep() {
  const dispatch = useDispatch();
  const investments = useSelector((s) => s.budget.investments);
  const income = useSelector((s) => s.budget.monthlyIncome);

  const total = getAllInvestmentsTotal(investments);
  const percentage = income > 0 ? ((total / income) * 100).toFixed(1) : 0;
  const isGood = percentage >= 30;
  const isOk = percentage >= 20;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <TrendingUp className="text-emerald-400" size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-1">Your Investments</h2>
        <p className="text-slate-500 text-[11px]">
          Tap any category &middot; Enter total or add individual funds
        </p>
      </div>

      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total</div>
          <div className="text-base font-bold text-emerald-400">{formatCurrency(total)}</div>
        </div>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: isGood ? 'rgba(16,185,129,0.12)' : isOk ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)',
            color: isGood ? '#34d399' : isOk ? '#fbbf24' : '#fb7185',
          }}
        >
          {percentage}% of income
        </span>
      </div>

      <div className="space-y-0.5">
        {CATEGORIES.map((catDef) => (
          <CategoryRow
            key={catDef.key}
            catDef={catDef}
            catData={investments[catDef.key]}
            dispatch={dispatch}
          />
        ))}
      </div>

      <NavigationButtons
        onPrev={() => dispatch(prevStep())}
        onNext={() => dispatch(nextStep())}
      />
    </div>
  );
}
