import React from 'react';
import { Bill } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface BillCardProps {
  bill: Bill;
}

export const BillCard: React.FC<BillCardProps> = ({ bill }) => {
  const { updateBillStatus, deleteBill, formatCurrency } = useFinance();

  const isPaid = bill.status === 'paid';
  const isOverdue = bill.status === 'overdue';

  const statusConfig = {
    upcoming: { label: 'Upcoming', badge: 'bg-[#3B82F6]/20 text-[#3B82F6]', icon: Clock },
    paid: { label: 'Paid', badge: 'bg-[#22C55E]/20 text-[#22C55E]', icon: CheckCircle2 },
    overdue: { label: 'Overdue', badge: 'bg-[#EF4444]/20 text-[#EF4444]', icon: AlertCircle },
  };

  const currentStatus = statusConfig[bill.status] || statusConfig.upcoming;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="p-6 rounded-3xl glass-card border border-[#1E293B] flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#F8FAFC]">{bill.name}</h4>
            <p className="text-xs text-[#94A3B8]">
              {bill.owner} • {bill.category}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm(`Delete bill "${bill.name}"?`)) deleteBill(bill._id);
          }}
          className="text-[#94A3B8] hover:text-[#EF4444] p-2 rounded-xl hover:bg-[#1E293B] transition-colors"
          title="Delete Bill"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-[#1E293B] pt-3">
        <div>
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase">Due Date</p>
          <p className="text-xs font-bold text-[#F8FAFC]">
            {new Date(bill.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase">Amount</p>
          <p className="text-base font-extrabold text-[#F8FAFC]">{formatCurrency(bill.amount)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${currentStatus.badge}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {currentStatus.label}
        </span>

        {!isPaid ? (
          <button
            onClick={() => updateBillStatus(bill._id, 'paid')}
            className="px-3 py-1.5 rounded-xl bg-[#22C55E]/15 hover:bg-[#22C55E] text-[#22C55E] hover:text-white text-xs font-extrabold transition-all"
          >
            Mark Paid
          </button>
        ) : (
          <button
            onClick={() => updateBillStatus(bill._id, 'upcoming')}
            className="text-xs text-[#94A3B8] hover:underline"
          >
            Unmark Paid
          </button>
        )}
      </div>
    </div>
  );
};
