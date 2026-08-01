import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface TransactionFormModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ transaction, isOpen, onClose }) => {
  const { updateTransaction, owners } = useFinance();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [owner, setOwner] = useState<string>('Me');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [date, setDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategory(transaction.category);
      setOwner(transaction.owner);
      setPaymentMethod(transaction.paymentMethod);
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
      setNotes(transaction.notes || '');
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !amount || !description) return;

    await updateTransaction(transaction._id, {
      type,
      amount: parseFloat(amount),
      description,
      category,
      owner,
      paymentMethod,
      date,
      notes,
    });
    onClose();
  };

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 rounded-xl font-bold text-xs ${
              type === 'expense' ? 'bg-[#EF4444] text-white' : 'text-[#94A3B8]'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 rounded-xl font-bold text-xs ${
              type === 'income' ? 'bg-[#22C55E] text-white' : 'text-[#94A3B8]'
            }`}
          >
            Income
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Amount</label>
          <input
            type="number"
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#14F195]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Description</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#14F195]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Owner</label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2 text-sm text-white"
            >
              {owners.map((o) => (
                <option key={o._id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2 text-sm text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2 text-sm text-white"
            >
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2 text-sm text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-sm transition-colors mt-2"
        >
          Update Transaction
        </button>
      </form>
    </Modal>
  );
};
