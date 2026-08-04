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
    'compare', 'category'
  ];

  const hasFinancialIntent = financialKeywords.some((kw) => text.includes(kw)) || /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/.test(text);

  if (!hasFinancialIntent) {
    return DEFAULT_HELP_MESSAGE;
  }

  const allTx = transactions.length > 0 ? transactions : [
    { _id: '1', owner: 'Son (Sajith)', type: 'expense', amount: 120, category: 'Food', description: 'Coffee & Snacks', date: '2026-07-05', paymentMethod: 'UPI' },
    { _id: '2', owner: 'Son (Sajith)', type: 'expense', amount: 60, category: 'Transport', description: 'Metro Ride', date: '2026-07-05', paymentMethod: 'UPI' },
    { _id: '3', owner: 'Dad', type: 'expense', amount: 2400, category: 'Bills', description: 'Electricity Bill', date: '2026-07-04', paymentMethod: 'Bank Transfer' },
  ];

  if (text.includes('highest') || text.includes('largest') || text.includes('most expensive')) {
    const expenses = allTx.filter((t) => t.type === 'expense');
    if (expenses.length === 0) return 'No recorded expenses found.';
    const highest = expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0]);
    return `Your highest recorded expense is **${highest.description}** for **₹${highest.amount.toLocaleString()}** on ${highest.date} (${highest.category}).`;
  }

  if (text.includes('food')) {
    const foodTx = allTx.filter((t) => t.category.toLowerCase() === 'food');
    const total = foodTx.reduce((sum, t) => sum + t.amount, 0);
    const list = foodTx.map((t) => `• **${t.description}** (${t.owner}): ₹${t.amount}`).join('\n');
    return `### Food Expenses\n\n${list}\n\n**Total Food Expense**: ₹${total.toLocaleString()}`;
  }

  let ownerFilter: string | undefined = undefined;
  if (text.includes('father') || text.includes('dad')) ownerFilter = 'Dad';
  else if (text.includes('my ') || text.includes(' i ') || text.includes('son') || text.includes('sajith')) ownerFilter = 'Son';

  let filtered = allTx;
  if (ownerFilter) {
    filtered = filtered.filter((t) => t.owner.toLowerCase().includes(ownerFilter!.toLowerCase()));
  }

  let totalInc = 0;
  let totalExp = 0;

  filtered.forEach((t) => {
    if (t.type === 'income') totalInc += t.amount;
    else totalExp += t.amount;
  });

  const list = filtered
    .map((t) => `• **${t.description}** (${t.owner} - ${t.category}): ${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString()}`)
    .join('\n');

  let reply = `### Transactions Summary\n\n${list || 'No matching transactions found.'}\n\n`;
  if (totalInc > 0) reply += `**Total Income**: ₹${totalInc.toLocaleString()}\n`;
  reply += `**Total Expense**: ₹${totalExp.toLocaleString()}\n`;
  if (totalInc > 0) reply += `**Net Savings**: ₹${(totalInc - totalExp).toLocaleString()}\n`;

  return reply;
};
