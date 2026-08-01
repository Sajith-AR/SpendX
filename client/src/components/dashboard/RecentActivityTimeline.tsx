import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Transaction } from '../../types';

export const RecentActivityTimeline: React.FC = () => {
  const { transactions, formatCurrency } = useFinance();

  // Group transactions by Date label (Today, Yesterday, Date string)
  const groupTransactions = (txs: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    txs.slice(0, 15).forEach((t) => {
      const dStr = new Date(t.date).toISOString().split('T')[0];
      let label = new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      if (dStr === todayStr) label = 'Today';
      else if (dStr === yesterdayStr) label = 'Yesterday';

      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });

    return groups;
  };

  const grouped = groupTransactions(transactions);
  const groupKeys = Object.keys(grouped);

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#14F195]" /> Recent Activity
        </h3>
        <span className="text-xs font-medium text-[#94A3B8]">Timeline feed</span>
      </div>

      {groupKeys.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <p className="text-sm text-[#94A3B8]">No recent transactions found.</p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1E293B]">
          {groupKeys.map((groupLabel) => (
            <div key={groupLabel} className="space-y-3 relative pl-8">
              {/* Timeline Marker */}
              <div className="absolute left-2.5 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-[#14F195] border-4 border-[#0A0F1E]" />

              <h4 className="text-xs font-extrabold text-[#94A3B8] uppercase tracking-wider">
                {groupLabel}
              </h4>

              <div className="space-y-2">
                {grouped[groupLabel].map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <div
                      key={tx._id}
                      className="p-3.5 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] hover:border-[#3B82F6]/50 flex items-center justify-between gap-4 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isIncome ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#14F195] transition-colors">
                            {tx.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-0.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#1E293B] text-[10px] font-semibold text-[#3B82F6]">
                              {tx.owner}
                            </span>
                            <span>•</span>
                            <span>{tx.category}</span>
                            <span>•</span>
                            <span>{tx.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-extrabold ${
                            isIncome ? 'text-[#22C55E]' : 'text-[#F8FAFC]'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
