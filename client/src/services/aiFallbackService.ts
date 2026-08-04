import { Transaction } from '../types';

const DEFAULT_HELP_MESSAGE = `I couldn't understand that question. I am your SpendX AI Financial Assistant.

You can ask me questions like:
• *"What did I spend today?"*
• *"What did I spend on 07/05/2026?"*
• *"Show my food expenses"*
• *"What did my father spend this month?"*
• *"What is my highest expense?"*
• *"Give me my monthly summary"*`;

export const fallbackAIQuery = (question: string, transactions: Transaction[] = []): string => {
  const text = question.trim().toLowerCase();

  const financialKeywords = [
    'spend', 'spent', 'expense', 'expenses', 'income', 'earned', 'earning', 'earnings',
    'balance', 'summary', 'today', 'yesterday', 'this week', 'this month', 'june', 'july',
    'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march', 'april', 'may',
    'highest', 'lowest', 'largest', 'smallest', 'most', 'food', 'transport', 'shopping',
    'bills', 'health', 'entertainment', 'salary', 'father', 'dad', 'mother', 'family', 'sajith', 'son',
    'compare', 'category', 'how much'
  ];

  const hasFinancialIntent = financialKeywords.some((kw) => text.includes(kw)) || /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/.test(text);

  if (!hasFinancialIntent) {
    return DEFAULT_HELP_MESSAGE;
  }

  let filtered = transactions;

  let isMeOrSon = false;
  let isDad = false;

  if (text.includes('father') || text.includes('dad')) {
    isDad = true;
    filtered = filtered.filter((t) => t.owner.toLowerCase().includes('dad') || t.owner.toLowerCase().includes('father'));
  } else if (text.includes('my ') || text.includes(' i ') || text.includes('son') || text.includes('sajith') || text.startsWith('what did i') || text.startsWith('how much did i') || text.startsWith('show my')) {
    isMeOrSon = true;
    filtered = filtered.filter((t) => {
      const o = t.owner.toLowerCase();
      return o === 'me' || o.includes('son') || o.includes('sajith');
    });
  }

  // Date filtering logic for fallback
  const nowStr = new Date().toISOString().split('T')[0];
  if (text.includes('today')) {
    const todayItems = filtered.filter((t) => t.date.startsWith(nowStr));
    if (todayItems.length > 0) filtered = todayItems;
  }

  let totalInc = 0;
  let totalExp = 0;

  filtered.forEach((t) => {
    if (t.type === 'income') totalInc += t.amount;
    else totalExp += t.amount;
  });

  const periodTitle = text.includes('today')
    ? 'Today'
    : text.includes('this month')
    ? 'This Month'
    : 'Recent Period';

  if (filtered.length === 0) {
    const name = isDad ? 'Dad' : 'Sajith';
    return `### Summary for ${periodTitle}\n\nNo recorded transactions found for ${name}.\n\n**Total Expense**: ₹0\n**Total Income**: ₹0`;
  }

  const list = filtered
    .map((t) => `• **${t.description}** (${t.owner} - ${t.category}): ${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString()}`)
    .join('\n');

  let reply = `### Transactions for ${periodTitle}\n\n${list}\n\n`;
  if (totalInc > 0) reply += `**Total Income**: ₹${totalInc.toLocaleString()}\n`;
  reply += `**Total Expense**: ₹${totalExp.toLocaleString()}\n`;
  if (totalInc > 0) reply += `**Net Savings**: ₹${(totalInc - totalExp).toLocaleString()}\n`;

  return reply;
};
