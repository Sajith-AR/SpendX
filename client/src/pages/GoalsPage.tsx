import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalFormModal } from '../components/goals/GoalFormModal';
import { Target, Plus } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { goals } = useFinance();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <Target className="w-7 h-7 text-[#8B5CF6]" /> Savings Goals
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Track progress towards laptops, emergency funds, vacations, and major purchases.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> Create Savings Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="p-12 text-center glass-card border border-[#1E293B] rounded-3xl space-y-4">
          <Target className="w-12 h-12 text-[#94A3B8] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-[#F8FAFC]">No savings goals yet</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            Set up your first financial savings goal and track deposits over time.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#8B5CF6] text-white font-bold text-xs hover:bg-[#7c4dff] transition-all"
          >
            + Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g) => (
            <GoalCard key={g._id} goal={g} />
          ))}
        </div>
      )}

      <GoalFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
