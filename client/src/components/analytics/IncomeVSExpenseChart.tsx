import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const IncomeVSExpenseChart: React.FC = () => {
  const { transactions } = useFinance();

  // Aggregate by Month name
  const monthMap: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((tx) => {
    const d = new Date(tx.date);
    const monthLabel = d.toLocaleDateString('en-US', { month: 'short' });

    if (!monthMap[monthLabel]) {
      monthMap[monthLabel] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      monthMap[monthLabel].income += tx.amount;
    } else {
      monthMap[monthLabel].expense += tx.amount;
    }
  });

  const data = Object.keys(monthMap).map((m) => ({
    month: m,
    Income: monthMap[m].income,
    Expense: monthMap[m].expense,
  }));

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-4">
      <h3 className="text-lg font-bold text-[#F8FAFC]">Income vs Expense Comparison</h3>
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#94A3B8]">
            No transaction data available for comparison chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '16px', color: '#F8FAFC' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="Income" fill="#22C55E" radius={[8, 8, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Expense" fill="#EF4444" radius={[8, 8, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
