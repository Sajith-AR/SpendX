import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFinance } from '../../context/FinanceContext';

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetFormModal: React.FC<BudgetFormModalProps> = ({ isOpen, onClose }) => {
  const { saveBudget, currencySymbol } = useFinance();

  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');

  const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Education',
    'Health',
    'Entertainment',
    'Recharge',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    await saveBudget(category, parseFloat(amount));
    setAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Monthly Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">
            Monthly Limit ({currencySymbol})
          </label>
          <input
            type="number"
            required
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3 text-lg font-bold text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-sm transition-colors mt-2"
        >
          Save Monthly Budget
        </button>
      </form>
    </Modal>
  );
};
