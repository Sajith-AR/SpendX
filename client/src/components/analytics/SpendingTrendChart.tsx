import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const SpendingTrendChart: React.FC = () => {
  const { transactions } = useFinance();

  // Aggregate spending by Date (chronological)
  const dateMap: Record<string, number> = {};

  transactions
    .filter((t) => t.type === 'expense')
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((tx) => {
      const dStr = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap[dStr] = (dateMap[dStr] || 0) + tx.amount;
    });

  const data = Object.keys(dateMap).map((d) => ({
    date: d,
    Spending: dateMap[d],
  }));

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-4">
      <h3 className="text-lg font-bold text-[#F8FAFC]">Daily Spending Trend</h3>
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#94A3B8]">
            No spending trends recorded.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '16px', color: '#F8FAFC' }}
              />
              <Area type="monotone" dataKey="Spending" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#spendingGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
