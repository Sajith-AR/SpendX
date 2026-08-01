import React from 'react';
import { Modal } from '../ui/Modal';
import { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { Calendar } from 'lucide-react';

interface DayTransactionsModalProps {
  dateStr: string | null;
  transactions: Transaction[];
  isOpen: boolean;
  onClose: () => void;
}

export const DayTransactionsModal: React.FC<DayTransactionsModalProps> = ({
  dateStr,
  transactions,
  isOpen,
  onClose,
}) => {
  const { formatCurrency } = useFinance();
  if (!dateStr) return null;

  const formattedDate = new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Activity on ${formattedDate}`}>
      <div className="space-y-4">
        {/* Header Total */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <div>
            <p className="text-xs font-semibold text-[#94A3B8]">Total Expenses</p>
            <p className="text-xl font-extrabold text-[#EF4444]">{formatCurrency(totalExpense)}</p>
          </div>
          {totalIncome > 0 && (
            <div className="text-right">
              <p className="text-xs font-semibold text-[#94A3B8]">Total Income</p>
              <p className="text-xl font-extrabold text-[#22C55E]">+{formatCurrency(totalIncome)}</p>
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {transactions.length === 0 ? (
            <p className="text-center text-xs text-[#94A3B8] py-8">
              No transactions recorded on this day.
            </p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">{tx.description}</p>
                  <p className="text-xs text-[#94A3B8]">
                    {tx.owner} • {tx.category} • {tx.paymentMethod}
                  </p>
                </div>
                <p
                  className={`text-sm font-extrabold ${
                    tx.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#1E293B] hover:bg-[#334155] text-white font-bold text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
