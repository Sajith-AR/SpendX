import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFinance } from '../../context/FinanceContext';

interface BillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BillFormModal: React.FC<BillFormModalProps> = ({ isOpen, onClose }) => {
  const { createBill, owners, currencySymbol } = useFinance();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Bills');
  const [owner, setOwner] = useState('Me');
  const [recurring, setRecurring] = useState<'none' | 'monthly' | 'quarterly' | 'yearly'>('monthly');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !dueDate) return;

    await createBill({
      name,
      amount: parseFloat(amount),
      dueDate,
      category,
      owner,
      recurring,
    });

    setName('');
    setAmount('');
    setDueDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Upcoming Bill">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Bill Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Broadband Fiber, Electricity Bill..."
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">
              Amount ({currencySymbol})
            </label>
            <input
              type="number"
              required
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1499"
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Owner</label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC]"
            >
              {owners.map((o) => (
                <option key={o._id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Frequency</label>
            <select
              value={recurring}
              onChange={(e: any) => setRecurring(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC]"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="none">One-time</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563eb] text-white font-extrabold text-sm transition-colors mt-2"
        >
          Save Upcoming Bill
        </button>
      </form>
    </Modal>
  );
};
