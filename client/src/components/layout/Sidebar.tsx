import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Receipt,
  BarChart3,
  PieChart,
  Target,
  CalendarDays,
  CreditCard,
  Bot,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  onOpenAI: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAI }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Family & Shared', icon: Users, path: '/family' },
    { label: 'Daily Ledger', icon: Receipt, path: '/ledger' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Budgets', icon: PieChart, path: '/budgets' },
    { label: 'Savings Goals', icon: Target, path: '/goals' },
    { label: 'Spending Heatmap', icon: CalendarDays, path: '/heatmap' },
    { label: 'Upcoming Bills', icon: CreditCard, path: '/bills' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#0F172A] border-r border-[#1E293B] min-h-screen p-6 sticky top-0 h-screen overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#14F195] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#14F195]/20">
          <Sparkles className="w-6 h-6 text-[#0A0F1E]" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-wider">SpendX</h1>
          <p className="text-xs font-medium text-[#94A3B8]">Smart Personal & Family Finance</p>
        </div>
      </div>

      {/* AI Assistant Quick Trigger */}
      <button
        onClick={onOpenAI}
        className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/20 via-[#3B82F6]/20 to-[#14F195]/20 border border-[#8B5CF6]/40 hover:border-[#14F195] text-[#F8FAFC] flex items-center justify-between group transition-all shadow-md hover:shadow-purple-500/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/30 flex items-center justify-center text-[#14F195]">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-[#8B5CF6]">AI Assistant</p>
            <p className="text-xs text-[#94A3B8]">Query real data</p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-[#14F195] opacity-80 group-hover:scale-110 transition-transform" />
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
                isActive
                  ? 'text-[#14F195] bg-[#111827] border border-[#1E293B] shadow-inner'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-[#14F195] rounded-r-full"
                />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#14F195]' : 'text-[#94A3B8]'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="pt-6 border-t border-[#1E293B] mt-auto">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#111827] border border-[#1E293B]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-bold text-[#F8FAFC] truncate">{user?.name}</p>
              <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-[#94A3B8] hover:text-[#EF4444] p-2 rounded-xl hover:bg-[#1E293B] transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
