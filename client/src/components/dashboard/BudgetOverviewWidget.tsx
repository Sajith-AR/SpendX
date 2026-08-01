import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PieChart, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const BudgetOverviewWidget: React.FC = () => {
  const { budgets, formatCurrency } = useFinance();

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#8B5CF6]" /> Budget Monitors
        </h3>
        <Link
          to="/budgets"
          className="text-xs font-semibold text-[#14F195] hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-8 space-y-3">
          <p className="text-xs text-[#94A3B8]">No monthly budgets defined yet.</p>
          <Link
            to="/budgets"
            className="inline-block px-4 py-2 rounded-xl bg-[#14F195]/10 text-[#14F195] font-bold text-xs hover:bg-[#14F195]/20 transition-all"
          >
            + Create First Budget
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.slice(0, 4).map((b) => {
            const isWarning = b.percentage >= 80 && b.percentage < 90;
            const isCritical = b.percentage >= 90 && b.percentage < 100;
            const isExceeded = b.percentage >= 100;

            let barColor = 'bg-[#14F195]';
            if (isExceeded) barColor = 'bg-[#EF4444]';
            else if (isCritical) barColor = 'bg-[#EF4444]';
            else if (isWarning) barColor = 'bg-[#F59E0B]';

            return (
              <div key={b._id} className="p-4 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#F8FAFC]">{b.category}</span>
                    {(isWarning || isCritical || isExceeded) && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 ${
                          isExceeded
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : isCritical
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {isExceeded ? 'EXCEEDED' : `${b.percentage}% LIMIT`}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#94A3B8]">
                    {b.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-[#1E293B] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, b.percentage)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-1">
                  <span>Spent: <strong className="text-[#F8FAFC]">{formatCurrency(b.spent)}</strong></span>
                  <span>Target: <strong>{formatCurrency(b.amount)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
