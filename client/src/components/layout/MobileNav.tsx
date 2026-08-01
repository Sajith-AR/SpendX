import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  PieChart,
  Target,
  Users,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Ledger', icon: Receipt, path: '/ledger' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Budgets', icon: PieChart, path: '/budgets' },
    { label: 'Family', icon: Users, path: '/family' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-lg border-t border-[#1E293B] px-3 py-2 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                isActive ? 'text-[#14F195]' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
