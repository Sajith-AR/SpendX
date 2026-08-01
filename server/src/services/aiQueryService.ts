import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import { seedUserDemoData } from '../utils/seedData';

interface QueryResult {
  reply: string;
  summaryData?: any;
  transactions?: any[];
}

export const processFinancialQuery = async (userId: string, question: string): Promise<QueryResult> => {
  let userObjId: mongoose.Types.ObjectId;
  try {
    userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a3b');
  } catch {
    userObjId = new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a3b');
  }

  // Seed demo data automatically if database has 0 transactions for this user
  const count = await Transaction.countDocuments({ user: userObjId });
  if (count === 0) {
    await seedUserDemoData(userObjId.toString());
  }

  const text = question.trim().toLowerCase();
  const now = new Date();
  const currentYear = now.getFullYear();

  // 0. Handle Greetings & Small Talk
  const greetings = ['hi', 'hello', 'hey', 'hola', 'good morning', 'good afternoon', 'good evening', 'help', 'who are you'];
  if (greetings.includes(text) || text.startsWith('hi ') || text.startsWith('hello ')) {
    return {
      reply: `Hello Sajith! 👋 I am your SpendX AI Financial Assistant. How can I help you manage your money today?\n\nYou can ask me questions like:\n• *"What did I spend today?"*\n• *"What did I spend on 07/05/2026?"*\n• *"Show my food expenses"*\n• *"What did my father spend this month?"*\n• *"What is my highest expense?"*\n• *"Give me my monthly summary"*`,
    };
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
  let ownerFilter: string | undefined = undefined;
  if (text.includes('father') || text.includes("father's")) ownerFilter = 'Father';
  else if (text.includes('mother') || text.includes("mother's")) ownerFilter = 'Mother';
  else if (text.includes('family') || text.includes("family's")) ownerFilter = 'Family';
  else if (text.includes('my ') || text.includes(' i ') || text.startsWith('what did i') || text.startsWith('how much did i') || text.startsWith('show my')) ownerFilter = 'Me';

  // 1. Check for specific numeric date (e.g. 07/05/2026, 07-05-2026, 2026-07-05)
  const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
  const dateMatch = text.match(dateRegex);

  let specificDate: Date | null = null;
  if (dateMatch) {
    const day = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const year = parseInt(dateMatch[3], 10);
    specificDate = new Date(year, month - 1, day);
  } else {
    // Check word-based date (e.g. 5 july 2026)
    const monthNamesPattern = Object.keys(monthMap).join('|');
    const wordDateRegex = new RegExp(`(\\d{1,2})?\\s*(${monthNamesPattern})\\s*(\\d{4})?`);
    const wordMatch = text.match(wordDateRegex);
    if (wordMatch) {
      const day = wordMatch[1] ? parseInt(wordMatch[1], 10) : 1;
      const month = monthMap[wordMatch[2]];
      const year = wordMatch[3] ? parseInt(wordMatch[3], 10) : currentYear;
      specificDate = new Date(year, month - 1, day);
    }
  }

  // 2. Highest / Lowest Expense
  if (text.includes('highest expense') || text.includes('largest expense') || text.includes('most expensive')) {
    const query: any = { user: userObjId, type: 'expense' };
    if (ownerFilter) query.owner = ownerFilter;

    const highest = await Transaction.findOne(query).sort({ amount: -1 });
    if (!highest) {
      return { reply: 'No transactions were found for this period.' };
    }
    return {
      reply: `Your highest recorded expense is **${highest.description}** for **₹${highest.amount.toLocaleString()}** on ${new Date(highest.date).toLocaleDateString()} (${highest.category}).`,
      transactions: [highest],
    };
  }

  if (text.includes('lowest expense') || text.includes('smallest expense')) {
    const query: any = { user: userObjId, type: 'expense' };
    if (ownerFilter) query.owner = ownerFilter;

    const lowest = await Transaction.findOne(query).sort({ amount: 1 });
    if (!lowest) {
      return { reply: 'No transactions were found for this period.' };
    }
    return {
      reply: `Your lowest recorded expense is **${lowest.description}** for **₹${lowest.amount.toLocaleString()}** on ${new Date(lowest.date).toLocaleDateString()} (${lowest.category}).`,
      transactions: [lowest],
    };
  }

  // 3. Category am I spending most on
  if (text.includes('category am i spending the most') || text.includes('top category') || text.includes('most spending category')) {
    const breakdown = await Transaction.aggregate([
      { $match: { user: userObjId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    if (breakdown.length === 0) {
      return { reply: 'No transactions were found for this period.' };
    }

    const topCategory = breakdown[0];
    return {
      reply: `You spend the most on **${topCategory._id}** with total spending of **₹${topCategory.total.toLocaleString()}**.`,
    };
  }

  // 4. Compare months (e.g. "compare june and july")
  if (text.includes('compare')) {
    const monthsFound: number[] = [];
    for (const [mName, mNum] of Object.entries(monthMap)) {
      if (text.includes(mName)) monthsFound.push(mNum);
    }
    if (monthsFound.length >= 2) {
      const [m1, m2] = monthsFound;
      const getMonthTotals = async (m: number) => {
        const start = new Date(currentYear, m - 1, 1);
        const end = new Date(currentYear, m, 0, 23, 59, 59);
        const res = await Transaction.aggregate([
          { $match: { user: userObjId, date: { $gte: start, $lte: end } } },
          { $group: { _id: '$type', total: { $sum: '$amount' } } },
        ]);
        let inc = 0, exp = 0;
        res.forEach((r) => { if (r._id === 'income') inc = r.total; else exp = r.total; });
        return { income: inc, expense: exp, balance: inc - exp };
      };

      const d1 = await getMonthTotals(m1);
      const d2 = await getMonthTotals(m2);

      const m1Name = Object.keys(monthMap).find((k) => monthMap[k] === m1)?.toUpperCase();
      const m2Name = Object.keys(monthMap).find((k) => monthMap[k] === m2)?.toUpperCase();

      return {
        reply: `### Financial Comparison (${m1Name} vs ${m2Name})\n\n` +
               `**${m1Name}**: Income ₹${d1.income.toLocaleString()} | Expense ₹${d1.expense.toLocaleString()} | Net ₹${d1.balance.toLocaleString()}\n\n` +
               `**${m2Name}**: Income ₹${d2.income.toLocaleString()} | Expense ₹${d2.expense.toLocaleString()} | Net ₹${d2.balance.toLocaleString()}\n\n` +
               `*Expense difference*: ${d2.expense >= d1.expense ? '+' : ''}₹${(d2.expense - d1.expense).toLocaleString()}`,
      };
    }
  }

  // 5. Date-filtered query
  let startDate: Date;
  let endDate: Date;
  let periodTitle = '';

  if (text.includes('today')) {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    periodTitle = 'Today';
  } else if (text.includes('yesterday')) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    startDate = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0);
    endDate = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59);
    periodTitle = 'Yesterday';
  } else if (text.includes('this week')) {
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
    startDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate(), 0, 0, 0);
    endDate = new Date();
    periodTitle = 'This Week';
  } else if (text.includes('this month') || text.includes('monthly summary')) {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    periodTitle = 'This Month';
  } else if (specificDate) {
    startDate = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate(), 0, 0, 0);
    endDate = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate(), 23, 59, 59);
    periodTitle = specificDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } else {
    // Default to current month or overall filter
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    periodTitle = 'Current Period';
  }

  // Construct query
  const dbQuery: any = {
    user: userObjId,
    date: { $gte: startDate, $lte: endDate },
  };

  if (ownerFilter) {
    dbQuery.owner = ownerFilter;
  }

  // Category filter
  const categories = ['food', 'transport', 'shopping', 'bills', 'education', 'health', 'entertainment', 'salary', 'investment', 'recharge'];
  for (const cat) {
    if (text.includes(cat)) {
      dbQuery.category = new RegExp(cat, 'i');
      break;
    }
  }

  const items = await Transaction.find(dbQuery).sort({ date: -1 });

  if (items.length === 0) {
    // If no transactions found for explicit query date/range, try query across all dates for that category/owner
    delete dbQuery.date;
    const fallbackItems = await Transaction.find(dbQuery).sort({ date: -1 }).limit(10);
    if (fallbackItems.length === 0) {
      return { reply: 'No transactions were found for this period.' };
    }
    items.push(...fallbackItems);
  }

  let totalIncome = 0;
  let totalExpense = 0;
  items.forEach((item) => {
    if (item.type === 'income') totalIncome += item.amount;
    else totalExpense += item.amount;
  });

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
