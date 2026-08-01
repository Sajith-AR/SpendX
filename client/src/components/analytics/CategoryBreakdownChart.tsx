import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const CategoryBreakdownChart: React.FC = () => {
  const { transactions } = useFinance();

  const categoryMap: Record<string, number> = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    });

  const COLORS = ['#14F195', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#6366F1'];

  const data = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-4">
      <h3 className="text-lg font-bold text-[#F8FAFC]">Category Spending Breakdown</h3>
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#94A3B8]">
            No expense categories recorded yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '16px', color: '#F8FAFC' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
