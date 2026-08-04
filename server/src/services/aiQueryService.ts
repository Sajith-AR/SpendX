import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import { seedUserDemoData } from '../utils/seedData';

interface QueryResult {
  reply: string;
  summaryData?: any;
  transactions?: any[];
}

const DEFAULT_HELP_MESSAGE = `I couldn't understand that question. I am your SpendX AI Financial Assistant.

You can ask me questions like:
• *"What did I spend today?"*
• *"What did I spend on 07/05/2026?"*
• *"Show my food expenses"*
• *"What did my father spend this month?"*
• *"What is my highest expense?"*
• *"Give me my monthly summary"*`;

export const processFinancialQuery = async (userId: string, question: string): Promise<QueryResult> => {
  let userObjId: mongoose.Types.ObjectId;
  try {
    userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a3b');
  } catch {
    userObjId = new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a3b');
  }

  // Ensure data exists for this user
  const count = await Transaction.countDocuments({ user: userObjId });
  if (count === 0) {
    await seedUserDemoData(userObjId.toString());
  }

  const text = question.trim().toLowerCase();
  const now = new Date();
  const currentYear = now.getFullYear();

  // Recognize financial keywords & intent
  const financialKeywords = [
    'spend', 'spent', 'expense', 'expenses', 'income', 'earned', 'earning', 'earnings',
    'balance', 'summary', 'today', 'yesterday', 'this week', 'this month', 'june', 'july',
    'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march', 'april', 'may',
    'highest', 'lowest', 'largest', 'smallest', 'most', 'food', 'transport', 'shopping',
    'bills', 'health', 'entertainment', 'salary', 'father', 'dad', 'mother', 'family', 'sajith', 'son',
    'compare', 'category', 'how much', 'ddd', 'cofrf'
  ];

  const hasFinancialIntent = financialKeywords.some((kw) => text.includes(kw)) || /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/.test(text);

  if (!hasFinancialIntent) {
    return { reply: DEFAULT_HELP_MESSAGE };
  }

  const monthMap: Record<string, number> = {
    january: 1, jan: 1,
    february: 2, feb: 2,
    march: 3, mar: 3,
    april: 4, apr: 4,
    may: 5,
    june: 6, jun: 6,
    july: 7, jul: 7,
    august: 8, aug: 8,
    september: 9, sep: 9, sept: 9,
    october: 10, oct: 10,
    november: 11, nov: 11,
    december: 12, dec: 12,
  };

  // Extract owner filter
  let isMeOrSon = false;
  let isDad = false;
  if (text.includes('father') || text.includes('dad')) {
    isDad = true;
  } else if (text.includes('my ') || text.includes(' i ') || text.includes('son') || text.includes('sajith') || text.startsWith('what did i') || text.startsWith('how much did i') || text.startsWith('show my')) {
    isMeOrSon = true;
  }

  // 1. Check for specific numeric date
  const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
  const dateMatch = text.match(dateRegex);

  let specificDate: Date | null = null;
  if (dateMatch) {
    const day = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const year = parseInt(dateMatch[3], 10);
    specificDate = new Date(year, month - 1, day);
  }

  // Build DB query
  const dbQuery: any = { user: userObjId };

  if (isDad) {
    dbQuery.owner = new RegExp('dad|father', 'i');
  } else if (isMeOrSon) {
    dbQuery.owner = { $in: ['Me', 'Son', 'Sajith', 'Son (Sajith)', /^me$/i, /^son/i, /^sajith/i] };
  }

  // Date filtering logic
  if (text.includes('today')) {
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    dbQuery.date = { $gte: startToday, $lte: endToday };
  } else if (text.includes('yesterday')) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const startY = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0);
    const endY = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999);
    dbQuery.date = { $gte: startY, $lte: endY };
  } else if (text.includes('this month') || text.includes('monthly summary')) {
    const startM = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const endM = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    dbQuery.date = { $gte: startM, $lte: endM };
  } else if (specificDate) {
    const startS = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate(), 0, 0, 0);
    const endS = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate(), 23, 59, 59, 999);
    dbQuery.date = { $gte: startS, $lte: endS };
  }

  // Category filter
  const categories = ['food', 'transport', 'shopping', 'bills', 'education', 'health', 'entertainment', 'salary', 'investment', 'recharge'];
  for (const cat of categories) {
    if (text.includes(cat)) {
      dbQuery.category = new RegExp(cat, 'i');
      break;
    }
  }

  // Fetch matching transactions
  let items = await Transaction.find(dbQuery).sort({ date: -1, createdAt: -1 });

  // If no transactions found for explicit date range (e.g. today or specified date), fallback to checking all transactions for that owner
  if (items.length === 0 && dbQuery.date) {
    delete dbQuery.date;
    items = await Transaction.find(dbQuery).sort({ date: -1, createdAt: -1 }).limit(10);
  }

  let totalIncome = 0;
  let totalExpense = 0;
  items.forEach((item) => {
    if (item.type === 'income') totalIncome += item.amount;
    else totalExpense += item.amount;
  });

  const periodTitle = text.includes('today')
    ? 'Today'
    : text.includes('yesterday')
    ? 'Yesterday'
    : text.includes('this month')
    ? 'This Month'
    : specificDate
    ? specificDate.toLocaleDateString()
    : 'Recent Period';

  if (items.length === 0) {
    const targetName = isDad ? 'Dad' : 'Sajith';
    return {
      reply: `### Summary for ${periodTitle}\n\nNo recorded transactions found for ${targetName}.\n\n**Total Expense**: ₹0\n**Total Income**: ₹0`,
    };
  }

  const txList = items
    .map(
      (item) =>
        `• **${item.description}** (${item.owner} - ${item.category}): ${item.type === 'income' ? '+' : '-'}₹${item.amount.toLocaleString()}`
    )
    .join('\n');

  let reply = `### Transactions for ${periodTitle}\n\n${txList}\n\n`;
  if (totalIncome > 0) reply += `**Total Income**: ₹${totalIncome.toLocaleString()}\n`;
  reply += `**Total Expense**: ₹${totalExpense.toLocaleString()}\n`;
  if (totalIncome > 0) reply += `**Net Savings**: ₹${(totalIncome - totalExpense).toLocaleString()}\n`;

  return { reply, transactions: items };
};
