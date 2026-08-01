import { Transaction } from '../types';

export const fallbackAIQuery = (question: string, transactions: Transaction[] = []): string => {
  const text = question.trim().toLowerCase();
  const now = new Date();

  // Handle greetings
  const greetings = ['hi', 'hello', 'hey', 'hola', 'good morning', 'good afternoon', 'good evening', 'help'];
  if (greetings.includes(text) || text.startsWith('hi ') || text.startsWith('hello ')) {
    return `Hello Sajith! 👋 I am your SpendX AI Financial Assistant. How can I help you manage your money today?\n\nYou can ask me questions like:\n• *"What did I spend today?"*\n• *"What did I spend on 07/05/2026?"*\n• *"Show my food expenses"*\n• *"What did my father spend this month?"*\n• *"What is my highest expense?"*\n• *"Give me my monthly summary"*`;
  }

  // Default seed transactions if none passed
  const allTx = transactions.length > 0 ? transactions : [
    { _id: '1', owner: 'Me', type: 'expense', amount: 120, category: 'Food', description: 'Coffee & Snacks', date: '2026-07-05', paymentMethod: 'UPI' },
    { _id: '2', owner: 'Me', type: 'expense', amount: 60, category: 'Transport', description: 'Metro Ride', date: '2026-07-05', paymentMethod: 'UPI' },
    { _id: '3', owner: 'Father', type: 'expense', amount: 2400, category: 'Bills', description: 'Electricity Bill', date: '2026-07-04', paymentMethod: 'Bank Transfer' },
    { _id: '4', owner: 'Me', type: 'income', amount: 85000, category: 'Salary', description: 'Monthly Salary Credit', date: '2026-07-01', paymentMethod: 'Bank Transfer' },
    { _id: '5', owner: 'Mother', type: 'expense', amount: 3500, category: 'Shopping', description: 'Grocery Store', date: '2026-07-03', paymentMethod: 'Credit Card' },
  ];

  // Highest / Lowest expense
  if (text.includes('highest') || text.includes('largest') || text.includes('most expensive')) {
    const expenses = allTx.filter((t) => t.type === 'expense');
    if (expenses.length === 0) return 'No recorded expenses found.';
    const highest = expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0]);
    return `Your highest recorded expense is **${highest.description}** for **₹${highest.amount.toLocaleString()}** on ${highest.date} (${highest.category}).`;
  }

  // Category filter
  if (text.includes('food')) {
    const foodTx = allTx.filter((t) => t.category.toLowerCase() === 'food');
    const total = foodTx.reduce((sum, t) => sum + t.amount, 0);
    const list = foodTx.map((t) => `• **${t.description}** (${t.owner}): ₹${t.amount}`).join('\n');
    return `### Food Expenses\n\n${list}\n\n**Total Food Expense**: ₹${total.toLocaleString()}`;
  }

  // Generic date/period fallback calculation
  let ownerFilter: string | undefined = undefined;
  if (text.includes('father')) ownerFilter = 'Father';
  else if (text.includes('mother')) ownerFilter = 'Mother';
  else if (text.includes('family')) ownerFilter = 'Family';
  else if (text.includes('my ') || text.includes(' i ') || text.startsWith('what did i') || text.startsWith('show my')) ownerFilter = 'Me';

  let filtered = allTx;
  if (ownerFilter) {
    filtered = filtered.filter((t) => t.owner.toLowerCase() === ownerFilter!.toLowerCase());
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
