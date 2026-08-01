import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types';
import { CalendarDays, Flame } from 'lucide-react';
import { DayTransactionsModal } from './DayTransactionsModal';

export const SpendingHeatmapGrid: React.FC = () => {
  const { transactions, formatCurrency } = useFinance();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Generate days for past 120 days (approx 4 months)
  const generateDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 119; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const isoStr = d.toISOString().split('T')[0];
      days.push({
        dateStr: isoStr,
        dateObj: d,
      });
    }
    return days;
  };

  const daysList = generateDays();

  // Aggregate expenses per day
  const dailyExpenses: Record<string, { total: number; txs: Transaction[] }> = {};
  transactions.forEach((tx) => {
    const dStr = new Date(tx.date).toISOString().split('T')[0];
    if (!dailyExpenses[dStr]) {
      dailyExpenses[dStr] = { total: 0, txs: [] };
    }
    dailyExpenses[dStr].txs.push(tx);
    if (tx.type === 'expense') {
      dailyExpenses[dStr].total += tx.amount;
    }
  });

  const getIntensityColor = (amount: number) => {
    if (amount === 0) return 'bg-[#1E293B]/40 hover:border-[#94A3B8]';
    if (amount < 1000) return 'bg-[#22C55E]/80 shadow-sm shadow-green-500/20 border-[#22C55E]';
    if (amount < 5000) return 'bg-[#F59E0B]/80 shadow-sm shadow-amber-500/20 border-[#F59E0B]';
    return 'bg-[#EF4444]/90 shadow-sm shadow-red-500/20 border-[#EF4444]';
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#1E293B] space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#14F195]" /> Daily Spending Heatmap
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1">
            GitHub-style contribution grid tracking financial activity intensity over the last 120 days.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold text-[#94A3B8]">
          <span>Low</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#1E293B]/60 border border-[#1E293B]" />
            <span className="w-3.5 h-3.5 rounded-md bg-[#22C55E]/80" title="< ₹1,000" />
            <span className="w-3.5 h-3.5 rounded-md bg-[#F59E0B]/80" title="₹1,000 - ₹5,000" />
            <span className="w-3.5 h-3.5 rounded-md bg-[#EF4444]/90" title="> ₹5,000" />
          </div>
          <span>High</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-2 min-w-[700px]">
          {daysList.map((day) => {
            const data = dailyExpenses[day.dateStr] || { total: 0, txs: [] };
            const colorClass = getIntensityColor(data.total);

            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDay(day.dateStr)}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border border-transparent transition-all transform hover:scale-125 focus:outline-none ${colorClass}`}
                title={`${day.dateStr}: ${data.total > 0 ? formatCurrency(data.total) : 'No expense'}`}
              />
            );
          })}
        </div>
      </div>

      {/* Selected Day Modal */}
      <DayTransactionsModal
        dateStr={selectedDay}
        transactions={selectedDay && dailyExpenses[selectedDay] ? dailyExpenses[selectedDay].txs : []}
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
};
