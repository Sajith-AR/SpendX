import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, Sliders } from 'lucide-react';
import { EditBalancesModal } from './EditBalancesModal';

export const HeaderWidget: React.FC = () => {
  const { user } = useAuth();
  const [isBalancesOpen, setIsBalancesOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 🌅';
    if (hour < 18) return 'Good Afternoon ☀️';
    return 'Good Evening 👋';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-card border border-[#1E293B] relative overflow-hidden">
        {/* Background Accent Gradient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#14F195]/10 via-[#3B82F6]/10 to-transparent blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs sm:text-sm font-semibold text-[#14F195] tracking-wider uppercase">
              {getGreeting()}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 flex items-center gap-1">
              <Users className="w-3 h-3" /> Shared Father & Son Account
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Welcome back, {user?.name || 'Sajith'}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Here is your shared Dad & Son financial portfolio summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBalancesOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#14F195]/15 hover:bg-[#14F195]/30 border border-[#14F195]/40 text-[#14F195] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Sliders className="w-4 h-4" /> Edit Balances (Son & Dad)
          </button>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] text-xs font-semibold text-[#94A3B8]">
            <Calendar className="w-4 h-4 text-[#3B82F6]" />
            <span>{currentDateFormatted}</span>
          </div>
        </div>
      </div>

      <EditBalancesModal isOpen={isBalancesOpen} onClose={() => setIsBalancesOpen(false)} />
    </>
  );
};
