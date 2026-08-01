import React, { useState } from 'react';
import { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { Eye, Edit3, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionDetailModal } from './TransactionDetailModal';
import { TransactionFormModal } from './TransactionFormModal';

interface DailyLedgerTableProps {
  transactions: Transaction[];
}

export const DailyLedgerTable: React.FC<DailyLedgerTableProps> = ({ transactions }) => {
  const { deleteTransaction, formatCurrency } = useFinance();

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'date') {
      const dA = new Date(a.date).getTime();
      const dB = new Date(b.date).getTime();
      return sortAsc ? dA - dB : dB - dA;
    } else {
      return sortAsc ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  const totalPages = Math.ceil(sortedTransactions.length / pageSize) || 1;
  const paginated = sortedTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-3xl glass-card border border-[#1E293B] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#0F172A] border-b border-[#1E293B] text-[11px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
              <th className="py-4 px-6 cursor-pointer hover:text-white" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">
                  Date <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-6">Owner</th>
              <th className="py-4 px-6">Type</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Payment</th>
              <th className="py-4 px-6 cursor-pointer hover:text-white text-right" onClick={() => handleSort('amount')}>
                <div className="flex items-center justify-end gap-1">
                  Amount <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B] text-xs font-semibold">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#94A3B8]">
                  No matching transactions found in the ledger.
                </td>
              </tr>
            ) : (
              paginated.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx._id} className="hover:bg-[#1E293B]/40 transition-colors group">
                    <td className="py-4 px-6 text-[#F8FAFC]">
                      {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-xl bg-[#1E293B] text-[#3B82F6] text-[11px] font-bold">
                        {tx.owner}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10px] uppercase font-extrabold ${
                          isIncome ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#F8FAFC] font-bold max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-4 px-6 text-[#94A3B8]">{tx.category}</td>
                    <td className="py-4 px-6 text-[#94A3B8]">{tx.paymentMethod}</td>
                    <td className={`py-4 px-6 text-right font-extrabold text-sm ${isIncome ? 'text-[#22C55E]' : 'text-[#F8FAFC]'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#14F195] hover:bg-[#1E293B] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#1E293B] transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this transaction?')) {
                              deleteTransaction(tx._id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1E293B] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-[#0F172A] border-t border-[#1E293B] flex items-center justify-between text-xs text-[#94A3B8]">
        <span>
          Showing {paginated.length} of {transactions.length} entries
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-[#111827] border border-[#1E293B] disabled:opacity-40 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-[#F8FAFC]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-[#111827] border border-[#1E293B] disabled:opacity-40 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTx}
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />

      {/* Edit Modal */}
      <TransactionFormModal
        transaction={editingTx}
        isOpen={!!editingTx}
        onClose={() => setEditingTx(null)}
      />
    </div>
  );
};
