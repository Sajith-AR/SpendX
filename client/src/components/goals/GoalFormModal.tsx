import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFinance } from '../../context/FinanceContext';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({ isOpen, onClose }) => {
  const { createGoal, currencySymbol } = useFinance();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Electronics');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    await createGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline: deadline || undefined,
      category,
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Savings Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Goal Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. New Laptop, Emergency Fund..."
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">
              Target ({currencySymbol})
            </label>
            <input
              type="number"
              required
              step="any"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="80000"
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">
              Initial Saved ({currencySymbol})
            </label>
            <input
              type="number"
              step="any"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC]"
            >
              <option value="Electronics">Electronics</option>
              <option value="Savings">Savings</option>
              <option value="Travel">Travel</option>
              <option value="Home">Home</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Target Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-extrabold text-sm transition-colors mt-2"
        >
          Create Savings Goal
        </button>
      </form>
    </Modal>
  );
};
