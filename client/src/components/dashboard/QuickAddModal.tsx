import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFinance } from '../../context/FinanceContext';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, owners, currencySymbol } = useFinance();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [owner, setOwner] = useState<string>('Me');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Education',
    'Health',
    'Entertainment',
    'Salary',
    'Investment',
    'Recharge',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    setSubmitting(true);
    try {
      await addTransaction({
        type,
        amount: parseFloat(amount),
        description,
        category,
        owner,
        paymentMethod,
        date,
        notes,
      });
      // Reset form
      setAmount('');
      setDescription('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              if (category === 'Salary') setCategory('Food');
            }}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              type === 'expense'
                ? 'bg-[#EF4444] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <MinusCircle className="w-4 h-4" /> Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('Salary');
            }}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              type === 'income'
                ? 'bg-[#22C55E] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            Amount ({currencySymbol})
          </label>
          <input
            type="number"
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3 text-lg font-bold text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            Description
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Starbucks Coffee, Uber ride, Salary..."
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
          />
        </div>

        {/* Owner & Category Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              Account Owner
            </label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
            >
              {owners.map((o) => (
                <option key={o._id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Method & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
            >
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add extra details..."
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-lg mt-2 ${
            type === 'expense'
              ? 'bg-[#EF4444] hover:bg-[#dc2626] text-white shadow-red-500/20'
              : 'bg-[#22C55E] hover:bg-[#16a34a] text-white shadow-green-500/20'
          }`}
        >
          {submitting ? 'Saving Transaction...' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
        </button>
      </form>
    </Modal>
  );
};
