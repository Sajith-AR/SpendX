import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { User, DollarSign, Palette, Bell, Database, Save, Sparkles } from 'lucide-react';

export const SettingsForm: React.FC = () => {
  const { user, updateUser, loadDemoData } = useAuth();
  const { currency, setCurrency, owners, refreshAll, showToast } = useFinance();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [defaultCurrency, setDefaultCurrency] = useState(currency || 'INR');
  const [dateFormat, setDateFormat] = useState(user?.dateFormat || 'DD/MM/YYYY');
  const [defaultOwner, setDefaultOwner] = useState(user?.defaultOwner || 'Me');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        name,
        defaultCurrency,
        dateFormat,
        theme,
        defaultOwner,
        notificationsEnabled,
      });
      setCurrency(defaultCurrency);
      showToast('Settings saved successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadDemo = async () => {
    setSeeding(true);
    try {
      await loadDemoData();
      await refreshAll();
      showToast('Demo dataset loaded successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to seed demo data', 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      {/* User Profile Section */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#1E293B] space-y-6">
        <h3 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
          <User className="w-5 h-5 text-[#14F195]" /> Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-[#0F172A]/50 border border-[#1E293B] rounded-2xl px-4 py-3 text-sm text-[#94A3B8] cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Financial Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#1E293B] space-y-6">
        <h3 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#3B82F6]" /> Platform Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Default Currency</label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-3 text-sm text-[#F8FAFC]"
            >
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
              <option value="GBP">£ GBP (British Pound)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-3 text-sm text-[#F8FAFC]"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (Standard)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Default Owner</label>
            <select
              value={defaultOwner}
              onChange={(e) => setDefaultOwner(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 py-3 text-sm text-[#F8FAFC]"
            >
              {owners.map((o) => (
                <option key={o._id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Theme & Notifications */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#1E293B] space-y-6">
        <h3 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#8B5CF6]" /> Appearance & Notifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-2">Theme Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`py-2.5 rounded-2xl font-bold text-xs uppercase border transition-all ${
                    theme === t
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6]'
                      : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
            <div>
              <p className="text-sm font-bold text-[#F8FAFC]">System Notifications</p>
              <p className="text-xs text-[#94A3B8]">Budget & Bill Alerts</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#14F195] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Seed Demo Data Option */}
      <div className="p-6 rounded-3xl glass-card border border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#F59E0B]" /> Demo Data Populator
          </h4>
          <p className="text-xs text-[#94A3B8]">
            Instantly seed realistic transactions, budgets, goals, and bills for immediate testing.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadDemo}
          disabled={seeding}
          className="px-4 py-2.5 rounded-2xl bg-[#F59E0B]/20 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-black font-extrabold text-xs transition-all flex items-center gap-2 border border-[#F59E0B]/40"
        >
          <Sparkles className="w-4 h-4" /> {seeding ? 'Seeding...' : 'Populate Demo Data'}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-4 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#14F195]/20"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
};
