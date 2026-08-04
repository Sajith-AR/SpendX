import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Users, Plus, Trash2, ShieldCheck, Wallet, ArrowUpRight, ArrowDownLeft, HeartHandshake } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const FamilyPage: React.FC = () => {
  const { owners, summary, addOwner, deleteOwner, formatCurrency } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [color, setColor] = useState('#3B82F6');

  const handleAddOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await addOwner(name, relationship, color);
    setName('');
    setIsAddOpen(false);
  };

  const ownerBreakdown = summary?.ownerBreakdown || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-7 h-7 text-[#14F195]" /> Shared Father & Son Account
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Manage individual balances and joint household finances between Dad and Son (Sajith).
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563eb] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Add Account Member
        </button>
      </div>

      {/* Combined Balance Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#1E293B] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#14F195]/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#14F195] uppercase tracking-wider">
              Total Combined Household Balance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#F8FAFC] tracking-tight mt-1">
              {formatCurrency(summary?.totalBalance || 0)}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">Son Balance + Dad Balance + Joint Family Funds</p>
          </div>
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <div>
              <p className="text-[#94A3B8]">Total Earnings</p>
              <p className="text-lg font-bold text-[#22C55E]">+{formatCurrency(summary?.totalIncome || 0)}</p>
            </div>
            <div>
              <p className="text-[#94A3B8]">Total Expenses</p>
              <p className="text-lg font-bold text-[#EF4444]">-{formatCurrency(summary?.totalExpense || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {owners.map((owner) => {
          const metrics = ownerBreakdown[owner.name] || { initialBalance: 0, income: 0, expense: 0, balance: 0 };
          return (
            <div
              key={owner._id}
              className="p-6 rounded-3xl glass-card border border-[#1E293B] space-y-4 relative group hover:border-[#14F195]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md text-base"
                    style={{ backgroundColor: owner.color || '#3B82F6' }}
                  >
                    {owner.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#F8FAFC]">{owner.name}</h4>
                    <p className="text-xs text-[#94A3B8]">{owner.relationship}</p>
                  </div>
                </div>

                {!owner.isSystem && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove owner ${owner.name}?`)) deleteOwner(owner._id);
                    }}
                    className="text-[#94A3B8] hover:text-[#EF4444] p-2 rounded-xl hover:bg-[#1E293B] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-1 pt-2">
                <p className="text-xs font-semibold text-[#94A3B8]">Current Available Balance</p>
                <p className={`text-2xl font-black ${metrics.balance >= 0 ? 'text-[#14F195]' : 'text-[#EF4444]'}`}>
                  {formatCurrency(metrics.balance)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-[#1E293B] pt-3 text-xs">
                <div>
                  <span className="text-[#94A3B8] text-[10px] uppercase font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-[#22C55E]" /> Income
                  </span>
                  <p className="font-bold text-[#22C55E]">{formatCurrency(metrics.income)}</p>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] uppercase font-bold flex items-center gap-1">
                    <ArrowDownLeft className="w-3 h-3 text-[#EF4444]" /> Expense
                  </span>
                  <p className="font-bold text-[#F8FAFC]">{formatCurrency(metrics.expense)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Owner Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Family Account Member">
        <form onSubmit={handleAddOwner} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Member Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dad, Sibling, Grandfather..."
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-[#F8FAFC]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC]"
              >
                <option value="Father">Father / Dad</option>
                <option value="Son">Son / Sajith</option>
                <option value="Family">Family</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Color Tag</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 bg-[#0F172A] border border-[#1E293B] rounded-2xl px-2 py-1 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563eb] text-white font-extrabold text-sm transition-colors mt-2"
          >
            Create Account Member
          </button>
        </form>
      </Modal>
    </div>
  );
};
