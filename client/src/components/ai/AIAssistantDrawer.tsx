import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, User, RefreshCw } from 'lucide-react';
import { SuggestedPrompts } from './SuggestedPrompts';
import { api } from '../../services/api';
import { useFinance } from '../../context/FinanceContext';
import { fallbackAIQuery } from '../../services/aiFallbackService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple markdown formatter helper to convert markdown syntax to styled JSX
const renderFormattedText = (content: string) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header 3: ### Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-sm font-extrabold text-[#14F195] pt-1 pb-0.5 tracking-tight border-b border-[#1E293B]/60 mb-1">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // Bullet point: • or -
        const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ');
        const textToFormat = isBullet ? trimmed.substring(2) : trimmed;

        // Parse **bold** parts
        const parts = textToFormat.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-extrabold text-[#F8FAFC]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <em key={pIdx} className="italic text-[#14F195]">
                {part.slice(1, -1)}
              </em>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5 text-xs text-[#E2E8F0]">
              <span className="text-[#14F195] font-bold mt-0.5">•</span>
              <span className="flex-1">{formattedLine}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-xs text-[#E2E8F0] leading-relaxed">
            {formattedLine}
          </p>
        );
      })}
    </div>
  );
};

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const { transactions } = useFinance();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello Sajith! 👋 I am your SpendX AI Financial Assistant. Ask me anything about your spending, income, or family accounts (e.g. *"What did I spend on 07/05/2026?"* or *"What did my father spend this month?"*). All answers are calculated directly from your real stored transactions!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/query', { question: q });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.answer || fallbackAIQuery(q, transactions),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Automatic seamless fallback using client transactions state
      const fallbackAnswer = fallbackAIQuery(q, transactions);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallbackAnswer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A0F1E]/80 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0F172A] border-l border-[#1E293B] shadow-2xl flex flex-col z-10"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#14F195] flex items-center justify-center text-white shadow-lg">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#F8FAFC] flex items-center gap-1.5">
                    SpendX AI Assistant <Sparkles className="w-4 h-4 text-[#14F195]" />
                  </h3>
                  <p className="text-xs text-[#94A3B8]">Deterministic NLP • Real DB Aggregation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 pb-8">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-3xl max-w-[88%] text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#14F195] text-[#0A0F1E] font-bold rounded-tr-none shadow-md'
                        : 'glass-card border border-[#1E293B] text-[#F8FAFC] rounded-tl-none shadow-md'
                    }`}
                  >
                    {m.sender === 'ai' ? renderFormattedText(m.text) : m.text}
                  </div>
                  {m.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white flex-shrink-0 font-bold text-xs mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-semibold p-3 bg-[#111827] border border-[#1E293B] rounded-2xl w-fit">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#14F195]" /> Querying MongoDB aggregation engine...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts & Input Footer */}
            <div className="p-4 border-t border-[#1E293B] bg-[#111827] space-y-4">
              <SuggestedPrompts onSelect={(prompt) => handleSend(prompt)} />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a financial question..."
                  className="flex-1 bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white disabled:opacity-50 hover:opacity-90 transition-all font-bold shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
