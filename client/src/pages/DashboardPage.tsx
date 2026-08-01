import React from 'react';
import { HeaderWidget } from '../components/dashboard/HeaderWidget';
import { BalanceCards } from '../components/dashboard/BalanceCards';
import { SpendingTrendChart } from '../components/analytics/SpendingTrendChart';
import { CategoryBreakdownChart } from '../components/analytics/CategoryBreakdownChart';
import { RecentActivityTimeline } from '../components/dashboard/RecentActivityTimeline';
import { BudgetOverviewWidget } from '../components/dashboard/BudgetOverviewWidget';
import { useFinance } from '../context/FinanceContext';
import { SkeletonLoader } from '../components/ui/Skeleton';

export const DashboardPage: React.FC = () => {
  const { loading } = useFinance();

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Header */}
      <HeaderWidget />

      {/* 7 Key Financial Cards */}
      <BalanceCards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingTrendChart />
        </div>
        <div>
          <CategoryBreakdownChart />
        </div>
      </div>

      {/* Activity Timeline & Budgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityTimeline />
        <BudgetOverviewWidget />
      </div>
    </div>
  );
};
