import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, User, RefreshCw } from 'lucide-react';
import { SuggestedPrompts } from './SuggestedPrompts';
import { api } from '../../services/api';

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

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your SpendX AI Financial Assistant. Ask me anything about your spending, income, or family accounts (e.g. *"What did I spend on 07/05/2026?"* or *"What did my father spend this month?"*). All answers are calculated directly from your real stored transactions!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
        text: res.answer || 'No response returned.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Error: ${err.message || 'Could not query financial database.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
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
            <div className="p-6 border-b border-[#1E293B] flex items-center justify-between bg-[#111827]">
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
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-3xl max-w-[85%] text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      m.sender === 'user'
                        ? 'bg-[#14F195] text-[#0A0F1E] font-bold rounded-tr-none'
                        : 'glass-card border border-[#1E293B] text-[#F8FAFC] rounded-tl-none space-y-2'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white flex-shrink-0 font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-semibold p-3">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Querying MongoDB aggregation engine...
                </div>
              )}
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
                  className="p-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white disabled:opacity-50 hover:opacity-90 transition-all font-bold"
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
