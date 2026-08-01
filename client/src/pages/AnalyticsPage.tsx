import React from 'react';
import { BarChart3 } from 'lucide-react';
import { IncomeVSExpenseChart } from '../components/analytics/IncomeVSExpenseChart';
import { SpendingTrendChart } from '../components/analytics/SpendingTrendChart';
import { CategoryBreakdownChart } from '../components/analytics/CategoryBreakdownChart';
import { OwnerComparisonChart } from '../components/analytics/OwnerComparisonChart';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[#3B82F6]" /> Financial Analytics
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Interactive Recharts dashboards updating from real transaction data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeVSExpenseChart />
        <SpendingTrendChart />
        <CategoryBreakdownChart />
        <OwnerComparisonChart />
      </div>
    </div>
  );
};
