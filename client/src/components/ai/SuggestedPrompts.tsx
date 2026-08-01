import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelect }) => {
  const prompts = [
    'What did I spend today?',
    'What did I spend on 07/05/2026?',
    'How much did I spend this month?',
    'What did my father spend this month?',
    'Show my food expenses',
    'What is my highest expense?',
    'Compare June and July',
    'What category am I spending the most on?',
    'Give me my monthly summary',
  ];

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-extrabold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#14F195]" /> Suggested Queries
      </p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="text-xs bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#8B5CF6] text-[#F8FAFC] px-3 py-1.5 rounded-xl transition-all font-medium text-left"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
