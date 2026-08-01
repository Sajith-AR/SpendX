import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFinance } from '../../context/FinanceContext';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { selectedOwner, showToast } = useFinance();

  const [rangeType, setRangeType] = useState<'all' | 'current_month' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  const handleExport = () => {
    let url = `/api/export/csv?owner=${encodeURIComponent(selectedOwner)}`;

    if (rangeType === 'current_month') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      url += `&startDate=${firstDay}&endDate=${lastDay}`;
    } else if (rangeType === 'custom' && startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    if (exportFormat === 'csv') {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SpendX_Statement_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('CSV statement downloaded.', 'success');
    } else {
      // PDF print window view
      window.print();
      showToast('Preparing PDF printable statement.', 'info');
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Financial Data">
      <div className="space-y-4">
        {/* Format selector */}
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-2">Export Format</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExportFormat('csv')}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-3 font-bold text-xs transition-all ${
                exportFormat === 'csv'
                  ? 'bg-[#14F195]/15 border-[#14F195] text-[#14F195]'
                  : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8]'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" /> CSV Spreadsheet
            </button>
            <button
              type="button"
              onClick={() => setExportFormat('pdf')}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-3 font-bold text-xs transition-all ${
                exportFormat === 'pdf'
                  ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6]'
                  : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8]'
              }`}
            >
              <FileText className="w-5 h-5" /> Printable PDF Report
            </button>
          </div>
        </div>

        {/* Range Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-2">Time Range</label>
          <select
            value={rangeType}
            onChange={(e: any) => setRangeType(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3 text-sm text-[#F8FAFC]"
          >
            <option value="all">All Transactions</option>
            <option value="current_month">Current Month Only</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>

        {rangeType === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2 text-sm text-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-2 text-sm text-[#F8FAFC]"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleExport}
          className="w-full py-3.5 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-sm transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <Download className="w-4 h-4" /> Download Statement
        </button>
      </div>
    </Modal>
  );
};
