import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar } from 'lucide-react';

export const HeaderWidget: React.FC = () => {
  const { user } = useAuth();

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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-card border border-[#1E293B] relative overflow-hidden">
      {/* Background Accent Gradient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#14F195]/10 via-[#3B82F6]/10 to-transparent blur-3xl pointer-events-none" />

      <div>
        <span className="text-xs sm:text-sm font-semibold text-[#14F195] tracking-wider uppercase">
          {getGreeting()}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Welcome back, {user?.name || 'User'}
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Here is your financial portfolio summary for shared & personal accounts.
        </p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] text-xs font-semibold text-[#94A3B8]">
        <Calendar className="w-4 h-4 text-[#3B82F6]" />
        <span>{currentDateFormatted}</span>
      </div>
    </div>
  );
};
