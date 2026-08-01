import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const OwnerComparisonChart: React.FC = () => {
  const { summary } = useFinance();

  const breakdown = summary?.ownerBreakdown || {};

  const data = Object.keys(breakdown).map((owner) => ({
    owner,
    Income: breakdown[owner].income,
    Expense: breakdown[owner].expense,
    Balance: breakdown[owner].balance,
  }));

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-4">
      <h3 className="text-lg font-bold text-[#F8FAFC]">Family & Account Owner Breakdown</h3>
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#94A3B8]">
            No owner data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
              <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis type="category" dataKey="owner" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '16px', color: '#F8FAFC' }}
              />
              <Bar dataKey="Expense" fill="#EF4444" radius={[0, 8, 8, 0]} maxBarSize={25} />
              <Bar dataKey="Income" fill="#14F195" radius={[0, 8, 8, 0]} maxBarSize={25} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
