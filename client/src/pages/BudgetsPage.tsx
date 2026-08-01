import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BudgetCard } from '../components/budget/BudgetCard';
import { BudgetFormModal } from '../components/budget/BudgetFormModal';
import { PieChart, Plus } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const { budgets } = useFinance();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <PieChart className="w-7 h-7 text-[#8B5CF6]" /> Budget Management
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Set category limits with automated threshold alerts at 80%, 90%, and 100% capacity.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#14F195]/20"
        >
          <Plus className="w-4 h-4" /> Set Category Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="p-12 text-center glass-card border border-[#1E293B] rounded-3xl space-y-4">
          <PieChart className="w-12 h-12 text-[#94A3B8] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-[#F8FAFC]">No budgets created yet</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            Set your first monthly budget limit to monitor category spending and receive overspending alerts.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#14F195] text-[#0A0F1E] font-bold text-xs hover:bg-[#10d482] transition-all"
          >
            + Create First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => (
            <BudgetCard key={b._id} budget={b} />
          ))}
        </div>
      )}

      <BudgetFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
