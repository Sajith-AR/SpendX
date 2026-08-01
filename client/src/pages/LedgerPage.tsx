import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { DailyLedgerTable } from '../components/ledger/DailyLedgerTable';
import { FilterBar } from '../components/ledger/FilterBar';
import { ExportModal } from '../components/export/ExportModal';
import { QuickAddModal } from '../components/dashboard/QuickAddModal';
import { Receipt, Download, Plus } from 'lucide-react';

export const LedgerPage: React.FC = () => {
  const { transactions } = useFinance();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setCategoryFilter('All');
    setOwnerFilter('All');
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (ownerFilter !== 'All' && tx.owner !== ownerFilter) return false;
    if (typeFilter !== 'All' && tx.type !== typeFilter) return false;
    if (categoryFilter !== 'All' && tx.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchCat = tx.category.toLowerCase().includes(q);
      const matchNotes = (tx.notes || '').toLowerCase().includes(q);
      if (!matchDesc && !matchCat && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <Receipt className="w-7 h-7 text-[#14F195]" /> Daily Financial Ledger
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Complete transaction record with advanced search, filtering, and statement exports.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-[#111827] border border-[#1E293B] hover:border-[#3B82F6] text-[#F8FAFC] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-[#3B82F6]" /> Export Statement
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#14F195]/20"
          >
            <Plus className="w-4 h-4" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        ownerFilter={ownerFilter}
        setOwnerFilter={setOwnerFilter}
        resetFilters={resetFilters}
      />

      {/* Table */}
      <DailyLedgerTable transactions={filteredTransactions} />

      {/* Modals */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <QuickAddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
