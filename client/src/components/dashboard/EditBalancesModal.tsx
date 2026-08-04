import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useFinance } from '../../context/FinanceContext';
import { Wallet, Check, Sparkles } from 'lucide-react';

interface EditBalancesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditBalancesModal: React.FC<EditBalancesModalProps> = ({ isOpen, onClose }) => {
  const { owners, summary, updateInitialBalances, formatCurrency } = useFinance();

  const [sonBalance, setSonBalance] = useState<number>(200);
  const [dadBalance, setDadBalance] = useState<number>(500);

  useEffect(() => {
    if (summary?.ownerBreakdown) {
      const sonKey = Object.keys(summary.ownerBreakdown).find((k) =>
        k.toLowerCase().includes('son') || k.toLowerCase().includes('sajith') || k.toLowerCase().includes('me')
      );
      const dadKey = Object.keys(summary.ownerBreakdown).find((k) =>
        k.toLowerCase().includes('dad') || k.toLowerCase().includes('father')
      );

      if (sonKey && summary.ownerBreakdown[sonKey]?.initialBalance !== undefined) {
        setSonBalance(summary.ownerBreakdown[sonKey].initialBalance!);
      }
      if (dadKey && summary.ownerBreakdown[dadKey]?.initialBalance !== undefined) {
        setDadBalance(summary.ownerBreakdown[dadKey].initialBalance!);
      }
    }
  }, [summary, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sonOwner = owners.find(
      (o) => o.name.toLowerCase().includes('son') || o.name.toLowerCase().includes('sajith') || o.name.toLowerCase().includes('me')
    );
    const dadOwner = owners.find(
      (o) => o.name.toLowerCase().includes('dad') || o.name.toLowerCase().includes('father')
    );

    const sonName = sonOwner ? sonOwner.name : 'Son (Sajith)';
    const dadName = dadOwner ? dadOwner.name : 'Dad';

    await updateInitialBalances({
      [sonName]: Number(sonBalance) || 0,
      [dadName]: Number(dadBalance) || 0,
    });

    onClose();
  };

  const calculatedTotal = Number(sonBalance || 0) + Number(dadBalance || 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Dad & Son Balances">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#14F195]/10 border border-[#14F195]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14F195]/20 flex items-center justify-center text-[#14F195]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#14F195]">Total Combined Balance</p>
              <p className="text-xs text-[#94A3B8]">Calculated as Son + Dad Balances</p>
            </div>
          </div>
          <span className="text-xl font-black text-[#F8FAFC]">
            {formatCurrency(calculatedTotal)}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#14F195] uppercase mb-1">
            Son (Sajith)'s Balance
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">₹</span>
            <input
              type="number"
              required
              value={sonBalance}
              onChange={(e) => setSonBalance(Number(e.target.value))}
              placeholder="e.g. 200"
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl pl-8 pr-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#3B82F6] uppercase mb-1">
            Dad's Balance
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">₹</span>
            <input
              type="number"
              required
              value={dadBalance}
              onChange={(e) => setDadBalance(Number(e.target.value))}
              placeholder="e.g. 500"
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl pl-8 pr-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
        >
          <Check className="w-4 h-4" /> Save Balances ({formatCurrency(calculatedTotal)})
        </button>
      </form>
    </Modal>
  );
};
