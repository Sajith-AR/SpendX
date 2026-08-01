import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkline } from './Sparkline';
import { Wallet, UserCheck, Users, TrendingUp, TrendingDown, PiggyBank, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const BalanceCards: React.FC = () => {
  const { summary, formatCurrency } = useFinance();

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary?.totalBalance || 0),
      change: '+14.2%',
      isPositive: true,
      icon: Wallet,
      color: '#14F195',
      sparklineData: [40, 45, 55, 60, 75, 80, 92],
    },
    {
      title: 'My Balance',
      value: formatCurrency(summary?.myBalance || 0),
      change: '+8.5%',
      isPositive: true,
      icon: UserCheck,
      color: '#3B82F6',
      sparklineData: [20, 25, 30, 28, 35, 42, 50],
    },
    {
      title: 'Family Balance',
      value: formatCurrency(summary?.familyBalance || 0),
      change: '+5.7%',
      isPositive: true,
      icon: Users,
      color: '#8B5CF6',
      sparklineData: [30, 32, 38, 40, 45, 48, 55],
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(summary?.totalIncome || 0),
      change: '+12.0%',
      isPositive: true,
      icon: TrendingUp,
      color: '#22C55E',
      sparklineData: [60, 65, 70, 75, 80, 85, 90],
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(summary?.totalExpense || 0),
      change: '-3.4%',
      isPositive: false,
      icon: TrendingDown,
      color: '#EF4444',
      sparklineData: [80, 75, 70, 68, 62, 58, 52],
    },
    {
      title: 'Savings',
      value: formatCurrency(summary?.savings || 0),
      change: '+18.1%',
      isPositive: true,
      icon: PiggyBank,
      color: '#14F195',
      sparklineData: [10, 20, 25, 35, 40, 50, 65],
    },
    {
      title: 'Savings Rate',
      value: `${summary?.savingsRate || 0}%`,
      change: '+4.2%',
      isPositive: true,
      icon: Percent,
      color: '#F59E0B',
      sparklineData: [30, 35, 40, 42, 48, 52, 60],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 sm:p-6 rounded-3xl glass-card border border-[#1E293B] relative overflow-hidden group transition-all"
          >
            {/* Top row: Icon & Sparkline */}
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${card.color}1A`, color: card.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <Sparkline data={card.sparklineData} color={card.color} />
            </div>

            {/* Middle: Title & Value */}
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{card.title}</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
              {card.value}
            </h3>

            {/* Bottom: Change Badge */}
            <div className="flex items-center gap-1.5 mt-3 text-xs font-bold">
              <span
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
                  card.isPositive ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                }`}
              >
                {card.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {card.change}
              </span>
              <span className="text-[#94A3B8] text-[11px] font-medium">vs last month</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
