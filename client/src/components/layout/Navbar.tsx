import React, { useState } from 'react';
import { Bell, Search, User as UserIcon, LogOut, Settings, Users, Sparkles, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenAI: () => void;
  onOpenQuickAdd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAI, onOpenQuickAdd }) => {
  const { user, logout } = useAuth();
  const {
    owners,
    selectedOwner,
    setSelectedOwner,
    currency,
    setCurrency,
    notifications,
    unreadNotificationsCount,
    markNotificationsRead,
  } = useFinance();

  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0F1E]/90 backdrop-blur-md border-b border-[#1E293B] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Account Owner Filter & Quick Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <div className="relative">
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="appearance-none bg-[#111827] text-[#14F195] font-semibold text-xs sm:text-sm border border-[#1E293B] hover:border-[#14F195] rounded-2xl px-3 sm:px-4 py-2 pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#14F195] transition-all"
          >
            <option value="All">👥 All Accounts</option>
            {owners.map((o) => (
              <option key={o._id} value={o.name}>
                👤 {o.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#14F195] text-xs">
            ▼
          </div>
        </div>

        {/* Global Quick Action / Search */}
        <div className="relative flex-1 hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            onClick={onOpenAI}
            placeholder="Ask AI or search transactions... (e.g. 'Coffee yesterday')"
            className="w-full bg-[#111827] border border-[#1E293B] hover:border-[#3B82F6] text-[#F8FAFC] text-xs sm:text-sm rounded-2xl pl-10 pr-4 py-2 focus:outline-none cursor-pointer transition-all placeholder-[#94A3B8]"
            readOnly
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Switcher */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-[#111827] text-[#F8FAFC] border border-[#1E293B] hover:border-[#3B82F6] text-xs sm:text-sm font-semibold rounded-2xl px-2.5 sm:px-3 py-2 cursor-pointer focus:outline-none transition-all"
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
          <option value="GBP">£ GBP</option>
        </select>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all shadow-md shadow-[#14F195]/20 active:scale-95"
        >
          <span className="text-base leading-none">+</span>
          <span className="hidden sm:inline">Add Transaction</span>
        </button>

        {/* AI Quick Button on Mobile */}
        <button
          onClick={onOpenAI}
          className="lg:hidden p-2 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] hover:text-[#14F195]"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-2xl bg-[#111827] border border-[#1E293B] hover:border-[#94A3B8] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card border border-[#1E293B] rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
                <h4 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#14F195]" /> Notifications
                </h4>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={() => markNotificationsRead()}
                    className="text-xs text-[#14F195] hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] text-center py-6">No new notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 rounded-2xl border text-xs ${
                        n.read ? 'bg-[#0F172A]/50 border-[#1E293B] text-[#94A3B8]' : 'bg-[#111827] border-[#14F195]/30 text-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold">{n.title}</span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#14F195] to-[#3B82F6] p-0.5 shadow-md flex items-center justify-center"
          >
            <div className="w-full h-full rounded-[14px] bg-[#0F172A] flex items-center justify-center font-bold text-xs text-[#F8FAFC]">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 glass-card border border-[#1E293B] rounded-3xl p-3 shadow-2xl z-50 space-y-1">
              <div className="px-3 py-2 border-b border-[#1E293B] mb-2">
                <p className="font-bold text-sm text-[#F8FAFC]">{user?.name}</p>
                <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-xl flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" /> Account Settings
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/family');
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-xl flex items-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4" /> Manage Family Accounts
              </button>
              <div className="border-t border-[#1E293B] pt-1 mt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
