import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const iconMap = {
            success: <CheckCircle2 className="w-5 h-5 text-[#14F195]" />,
            error: <AlertCircle className="w-5 h-5 text-[#EF4444]" />,
            warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
            info: <Info className="w-5 h-5 text-[#3B82F6]" />,
          };

          const borderMap = {
            success: 'border-[#14F195]/40 bg-[#0F172A]/90',
            error: 'border-[#EF4444]/40 bg-[#0F172A]/90',
            warning: 'border-[#F59E0B]/40 bg-[#0F172A]/90',
            info: 'border-[#3B82F6]/40 bg-[#0F172A]/90',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`pointer-events-auto p-4 rounded-2xl border ${borderMap[toast.type]} shadow-xl backdrop-blur-md flex items-center gap-3 text-sm font-medium text-[#F8FAFC]`}
            >
              {iconMap[toast.type]}
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#94A3B8] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
