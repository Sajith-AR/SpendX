import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BillCard } from '../components/bills/BillCard';
import { BillFormModal } from '../components/bills/BillFormModal';
import { CreditCard, Plus } from 'lucide-react';

export const BillsPage: React.FC = () => {
  const { bills } = useFinance();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-[#3B82F6]" /> Upcoming Bills & Recurring Payments
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Never miss a bill payment. Track upcoming, overdue, and paid subscriptions.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563eb] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Add Bill
        </button>
      </div>

      {bills.length === 0 ? (
        <div className="p-12 text-center glass-card border border-[#1E293B] rounded-3xl space-y-4">
          <CreditCard className="w-12 h-12 text-[#94A3B8] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-[#F8FAFC]">No bills scheduled</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            Add recurring internet, electricity, insurance, or subscription bills to receive reminders.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#3B82F6] text-white font-bold text-xs hover:bg-[#2563eb] transition-all"
          >
            + Add First Bill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((b) => (
            <BillCard key={b._id} bill={b} />
          ))}
        </div>
      )}

      <BillFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
