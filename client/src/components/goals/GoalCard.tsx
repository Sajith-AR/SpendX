import React, { useState } from 'react';
import { Goal } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { Target, PlusCircle, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { AddMoneyModal } from './AddMoneyModal';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { deleteGoal, formatCurrency } = useFinance();
  const [showAddMoney, setShowAddMoney] = useState(false);

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-4 relative group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#F8FAFC]">{goal.name}</h4>
            <p className="text-xs text-[#94A3B8]">{goal.category || 'Savings Goal'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm(`Delete savings goal "${goal.name}"?`)) {
              deleteGoal(goal._id);
            }
          }}
          className="text-[#94A3B8] hover:text-[#EF4444] p-2 rounded-xl hover:bg-[#1E293B] transition-colors"
          title="Delete Goal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar & Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#94A3B8]">Saved: {formatCurrency(goal.currentAmount)}</span>
          <span className="text-[#14F195] font-extrabold">{goal.progress}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#1E293B] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, goal.progress)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#14F195]"
          />
        </div>
      </div>

      {/* Target & Deadline */}
      <div className="flex items-center justify-between text-xs border-t border-[#1E293B] pt-3 text-[#94A3B8]">
        <div>
          Target: <strong className="text-[#F8FAFC]">{formatCurrency(goal.targetAmount)}</strong>
        </div>
        {goal.deadline && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>{new Date(goal.deadline).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Add Money CTA Button */}
      <button
        onClick={() => setShowAddMoney(true)}
        className="w-full py-2.5 rounded-2xl bg-[#8B5CF6]/15 hover:bg-[#8B5CF6] text-[#8B5CF6] hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all border border-[#8B5CF6]/30"
      >
        <PlusCircle className="w-4 h-4" /> Add Money to Goal
      </button>

      {/* Modal */}
      <AddMoneyModal goal={goal} isOpen={showAddMoney} onClose={() => setShowAddMoney(false)} />
    </div>
  );
};
