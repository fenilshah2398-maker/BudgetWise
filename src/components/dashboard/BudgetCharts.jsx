import { useSelector } from 'react-redux';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar, Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import { getAllInvestmentsTotal } from '../../utils/investmentHelpers';
import { getCategoryBreakdown } from '../../utils/budgetAdvisor';

const MAIN_COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null;
  const data = payload[0];
  return (
    <div
      className="rounded-lg px-3.5 py-2.5 text-xs shadow-2xl"
      style={{
        background: 'linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))',
        border: '1px solid rgba(51,65,85,0.5)',
      }}
    >
      <p className="text-slate-400 font-medium mb-0.5">{data.name || data.payload?.name}</p>
      {data.payload?.category && (
        <p className="text-slate-600 text-[10px] mb-0.5">{data.payload.category}</p>
      )}
      <p className="text-slate-100 font-bold text-sm">{formatCurrency(data.value)}</p>
    </div>
  );
};

function ChartCard({ title, children }) {
  return (
    <div className="card p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function AllocationPieChart({ data }) {
  return (
    <ChartCard title="Budget Allocation">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value" stroke="none">
            {data.map((_, i) => <Cell key={i} fill={MAIN_COLORS[i % MAIN_COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: MAIN_COLORS[i] }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

function HorizontalBarChart({ title, data }) {
  if (!data.length) return null;
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 32 + 40)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
            axisLine={{ stroke: 'rgba(51,65,85,0.3)' }}
            tickLine={false}
          />
          <YAxis
            type="category" dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            width={110} axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={16}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function HealthGauge({ budget }) {
  const { monthlyIncome, investments, loans, expenses, savings } = budget;

  const totalInv = getAllInvestmentsTotal(investments);
  const totalLoans = Object.values(loans).reduce((s, v) => s + (v || 0), 0);
  const totalSav = Object.values(savings).reduce((s, v) => s + (v || 0), 0);

  const invScore = Math.min(((totalInv / monthlyIncome) / 0.30) * 100, 100);
  const loanScore = totalLoans === 0 ? 100 : Math.max(100 - ((totalLoans / monthlyIncome) / 0.40) * 100, 0);
  const expScore = Math.max(100 - (((expenses.monthly || 0) / monthlyIncome) / 0.50) * 100 + 50, 0);
  const savScore = Math.min(((totalSav / monthlyIncome) / 0.20) * 100, 100);

  const overallScore = Math.round((invScore + loanScore + Math.min(expScore, 100) + savScore) / 4);

  const gaugeData = [
    { name: 'Savings', value: savScore, fill: '#8b5cf6' },
    { name: 'Expenses', value: Math.min(expScore, 100), fill: '#f59e0b' },
    { name: 'Loans', value: Math.min(loanScore, 100), fill: '#f43f5e' },
    { name: 'Investments', value: invScore, fill: '#10b981' },
  ];

  return (
    <ChartCard title="Financial Health Score">
      <div className="text-center mb-2">
        <span
          className="text-4xl font-extrabold"
          style={{ color: overallScore >= 75 ? '#34d399' : overallScore >= 50 ? '#fbbf24' : '#fb7185' }}
        >
          {overallScore}
        </span>
        <span className="text-sm text-slate-600 font-medium">/100</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart cx="50%" cy="55%" innerRadius="25%" outerRadius="95%" data={gaugeData} startAngle={180} endAngle={0}>
          <RadialBar background={{ fill: 'rgba(30,41,59,0.5)' }} dataKey="value" cornerRadius={6} />
          <Legend
            iconSize={8} layout="horizontal" verticalAlign="bottom"
            formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default function BudgetCharts() {
  const budget = useSelector((s) => s.budget);
  const { monthlyIncome, loans, expenses, savings } = budget;

  const totalInv = getAllInvestmentsTotal(budget.investments);
  const totalLoans = Object.values(loans).reduce((s, v) => s + (v || 0), 0);
  const totalSav = Object.values(savings).reduce((s, v) => s + (v || 0), 0);
  const totalExp = expenses.monthly || 0;
  const unallocated = Math.max(monthlyIncome - totalInv - totalExp - totalLoans - totalSav, 0);

  const allocationData = [
    { name: 'Investments', value: totalInv },
    { name: 'Expenses', value: totalExp },
    { name: 'Loan EMIs', value: totalLoans },
    { name: 'Savings', value: totalSav },
    ...(unallocated > 0 ? [{ name: 'Unallocated', value: unallocated }] : []),
  ].filter((d) => d.value > 0);

  const breakdown = getCategoryBreakdown(budget);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AllocationPieChart data={allocationData} />
      <HealthGauge budget={budget} />

      <HorizontalBarChart title="Investment by Category" data={breakdown.investmentCategories} />

      {breakdown.investmentDetails.length > breakdown.investmentCategories.length && (
        <HorizontalBarChart title="Individual Fund Breakdown" data={breakdown.investmentDetails} />
      )}

      {breakdown.loans.length > 0 && (
        <ChartCard title="Loan Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={breakdown.loans} cx="50%" cy="50%" outerRadius={95}
                dataKey="value" stroke="none"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {breakdown.loans.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
