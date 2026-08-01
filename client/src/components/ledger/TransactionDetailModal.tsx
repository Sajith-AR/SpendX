import React from 'react';
import { Modal } from '../ui/Modal';
import { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { Tag, Calendar, User, CreditCard, FileText } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, isOpen, onClose }) => {
  const { formatCurrency } = useFinance();
  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div className="space-y-6">
        {/* Header summary */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#1E293B] text-center space-y-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
              isIncome ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#EF4444]/15 text-[#EF4444]'
            }`}
          >
            {transaction.type}
          </span>
          <h2 className="text-3xl font-extrabold text-[#F8FAFC]">
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </h2>
          <p className="text-sm font-semibold text-[#F8FAFC]">{transaction.description}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
          <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-1">
            <span className="text-[#94A3B8] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#3B82F6]" /> Owner
            </span>
            <p className="text-[#F8FAFC] text-sm font-bold">{transaction.owner}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-1">
            <span className="text-[#94A3B8] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#8B5CF6]" /> Category
            </span>
            <p className="text-[#F8FAFC] text-sm font-bold">{transaction.category}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-1">
            <span className="text-[#94A3B8] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#14F195]" /> Date
            </span>
            <p className="text-[#F8FAFC] text-sm font-bold">
              {new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-1">
            <span className="text-[#94A3B8] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#F59E0B]" /> Payment Method
            </span>
            <p className="text-[#F8FAFC] text-sm font-bold">{transaction.paymentMethod}</p>
          </div>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-1">
            <span className="text-[#94A3B8] text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Notes
            </span>
            <p className="text-xs text-[#F8FAFC]">{transaction.notes}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#1E293B] hover:bg-[#334155] text-white font-bold text-xs transition-colors"
        >
          Close View
        </button>
      </div>
    </Modal>
  );
};
