import React from 'react';
import { SettingsForm } from '../components/settings/SettingsForm';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#14F195]" /> Platform & Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Customize currency, themes, default owners, date formats, and notification alerts.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
};
