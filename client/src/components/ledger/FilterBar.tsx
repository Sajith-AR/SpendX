import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  ownerFilter: string;
  setOwnerFilter: (o: string) => void;
  resetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  ownerFilter,
  setOwnerFilter,
  resetFilters,
}) => {
  const { owners } = useFinance();

  const categories = [
    'All',
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
    <div className="p-4 sm:p-6 rounded-3xl glass-card border border-[#1E293B] space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#14F195]" /> Ledger Search & Filters
        </h4>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description or notes..."
            className="w-full bg-[#0F172A] border border-[#1E293B] hover:border-[#3B82F6] text-xs sm:text-sm text-[#F8FAFC] rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#14F195]"
          />
        </div>

        {/* Owner Filter */}
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-[#3B82F6] text-xs sm:text-sm text-[#F8FAFC] font-semibold rounded-2xl px-3 py-2.5 focus:outline-none focus:border-[#14F195]"
        >
          <option value="All">👤 All Account Owners</option>
          {owners.map((o) => (
            <option key={o._id} value={o.name}>
              👤 {o.name}
            </option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-[#3B82F6] text-xs sm:text-sm text-[#F8FAFC] font-semibold rounded-2xl px-3 py-2.5 focus:outline-none focus:border-[#14F195]"
        >
          <option value="All">💵 All Types (Income & Expense)</option>
          <option value="income">🟢 Income Only</option>
          <option value="expense">🔴 Expense Only</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-[#3B82F6] text-xs sm:text-sm text-[#F8FAFC] font-semibold rounded-2xl px-3 py-2.5 focus:outline-none focus:border-[#14F195]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              🏷️ {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
