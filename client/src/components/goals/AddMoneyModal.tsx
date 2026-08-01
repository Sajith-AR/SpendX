import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Goal } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface AddMoneyModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ goal, isOpen, onClose }) => {
  const { addMoneyToGoal, currencySymbol } = useFinance();
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    await addMoneyToGoal(goal._id, parseFloat(amount));
    setAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Deposit into "${goal.name}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">
            Deposit Amount ({currencySymbol})
          </label>
          <input
            type="number"
            required
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3 text-lg font-bold text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-extrabold text-sm transition-colors mt-2"
        >
          Confirm Savings Deposit
        </button>
      </form>
    </Modal>
  );
};
