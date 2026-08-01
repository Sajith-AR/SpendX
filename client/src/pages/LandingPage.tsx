import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Receipt,
  Users,
  PieChart,
  BarChart3,
  Bot,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleDemo = async () => {
    try {
      // Demo user direct login
      await login('demo@spendx.com', 'demo123');
      navigate('/dashboard');
    } catch {
      // If demo user doesn't exist yet, direct to register
      navigate('/register');
    }
  };

  const featureCards = [
    {
      title: 'Smart Expense Tracking',
      desc: 'Log income and expenses with automatic categorizations and multi-currency formatting.',
      icon: Receipt,
      color: '#14F195',
    },
    {
      title: 'Shared Family Accounts',
      desc: 'Track individual vs combined balances for Me, Father, Mother, Sibling, and custom owners.',
      icon: Users,
      color: '#3B82F6',
    },
    {
      title: 'Budget Planning & Alerts',
      desc: 'Set monthly category limits with real-time visual warnings at 80%, 90%, and 100% capacity.',
      icon: PieChart,
      color: '#F59E0B',
    },
    {
      title: 'Financial Analytics',
      desc: 'Interactive Recharts visualizations for income vs expense trends, donut breakdowns, and cash flow.',
      icon: BarChart3,
      color: '#EF4444',
    },
    {
      title: 'AI Financial Assistant',
      desc: 'Ask natural language questions like "What did I spend on 07/05/2026?" answered with 0% hallucination.',
      icon: Bot,
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F8FAFC] flex flex-col relative overflow-hidden selection:bg-[#14F195]/30">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-br from-[#14F195]/15 via-[#3B82F6]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-[#8B5CF6]/15 via-[#EF4444]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#14F195] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#14F195]/20">
            <Sparkles className="w-6 h-6 text-[#0A0F1E]" />
          </div>
          <span className="text-2xl font-black text-[#F8FAFC] tracking-wider">SpendX</span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-2xl bg-[#14F195] text-[#0A0F1E] font-extrabold text-sm hover:bg-[#10d482] transition-all shadow-lg shadow-[#14F195]/20"
            >
              Go to Dashboard →
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#94A3B8] hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 rounded-2xl bg-[#14F195] text-[#0A0F1E] font-extrabold text-xs sm:text-sm hover:bg-[#10d482] transition-all shadow-lg shadow-[#14F195]/20"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 sm:py-20 flex flex-col items-center text-center z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827] border border-[#1E293B] text-xs font-bold text-[#14F195] shadow-inner"
        >
          <Zap className="w-4 h-4 text-[#14F195]" /> Next-Generation FinTech Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F8FAFC] tracking-tight max-w-4xl leading-[1.15]"
        >
          Take Control of Your <span className="bg-gradient-to-r from-[#14F195] via-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">Money</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-[#94A3B8] max-w-2xl font-normal leading-relaxed"
        >
          Track spending, manage shared finances, build budgets, and understand where your money goes with our intelligent AI financial assistant.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-base transition-all shadow-xl shadow-[#14F195]/25 flex items-center justify-center gap-2 group"
          >
            Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#111827] hover:bg-[#1E293B] border border-[#1E293B] text-[#F8FAFC] font-extrabold text-base transition-all"
          >
            Sign In
          </button>
          <button
            onClick={handleDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 text-[#8B5CF6] font-extrabold text-base transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> View Demo
          </button>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-16 w-full text-left"
        >
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-6 rounded-3xl glass-card border border-[#1E293B] hover:border-[#14F195]/50 transition-all group space-y-4"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${card.color}1A`, color: card.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">{card.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#14F195]" /> SpendX Secure Financial Engine © 2026
        </div>
        <p>Built with Next.js, React, TypeScript, Node.js & MongoDB.</p>
      </footer>
    </div>
  );
};
