import React from 'react';
import { Budget } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { AlertTriangle, Trash2, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

interface BudgetCardProps {
  budget: Budget;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  const { deleteBudget, formatCurrency } = useFinance();

  const isWarning = budget.percentage >= 80 && budget.percentage < 90;
  const isCritical = budget.percentage >= 90 && budget.percentage < 100;
  const isExceeded = budget.percentage >= 100;

  let barColor = 'bg-[#14F195]';
  if (isExceeded || isCritical) barColor = 'bg-[#EF4444]';
  else if (isWarning) barColor = 'bg-[#F59E0B]';

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-4 relative group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center font-bold">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#F8FAFC]">{budget.category}</h4>
            <p className="text-xs text-[#94A3B8]">Monthly Budget</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm(`Delete budget for ${budget.category}?`)) {
              deleteBudget(budget._id);
            }
          }}
          className="text-[#94A3B8] hover:text-[#EF4444] p-2 rounded-xl hover:bg-[#1E293B] transition-colors"
          title="Delete Budget"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar & Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#94A3B8]">Progress ({budget.percentage}%)</span>
          {(isWarning || isCritical || isExceeded) && (
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-extrabold flex items-center gap-1 ${
                isExceeded
                  ? 'bg-[#EF4444]/20 text-[#EF4444]'
                  : isCritical
                  ? 'bg-[#EF4444]/20 text-[#EF4444]'
                  : 'bg-[#F59E0B]/20 text-[#F59E0B]'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              {isExceeded ? 'BUDGET EXCEEDED' : isCritical ? '90% LIMIT REACHED' : '80% LIMIT REACHED'}
            </span>
          )}
        </div>

        <div className="w-full h-3 rounded-full bg-[#1E293B] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, budget.percentage)}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${barColor}`}
          />
        </div>
      </div>

      {/* Metric details */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E293B] text-center text-xs">
        <div>
          <p className="text-[#94A3B8] text-[10px] font-semibold uppercase">Budget</p>
          <p className="font-extrabold text-[#F8FAFC]">{formatCurrency(budget.amount)}</p>
        </div>
        <div>
          <p className="text-[#94A3B8] text-[10px] font-semibold uppercase">Spent</p>
          <p className="font-extrabold text-[#EF4444]">{formatCurrency(budget.spent)}</p>
        </div>
        <div>
          <p className="text-[#94A3B8] text-[10px] font-semibold uppercase">Remaining</p>
          <p className={`font-extrabold ${budget.remaining < 0 ? 'text-[#EF4444]' : 'text-[#14F195]'}`}>
            {formatCurrency(budget.remaining)}
          </p>
        </div>
      </div>
    </div>
  );
};
