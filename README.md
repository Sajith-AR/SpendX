# SpendX — Smart Personal & Family Finance Management Platform

**SpendX** is a portfolio-grade, full-stack personal & family finance platform designed to track spending, manage shared household accounts, build category budgets with visual warning alerts, monitor savings goals, manage upcoming bills, view GitHub-style spending heatmaps, and query real stored financial data with a deterministic 0%-hallucination AI assistant.

---

## 🌟 Key Features

1. **Shared Family Finance System**:
   - Multi-owner balance tracking (Me, Father, Mother, Sibling, Family, and custom owners).
   - View individual vs combined household balances, income, and expenses.

2. **Deterministic AI Financial Assistant**:
   - Query stored financial records using natural language.
   - Example queries:
     - *"What did I spend on 07/05/2026?"*
     - *"What did my father spend this month?"*
     - *"Show my food expenses."*
     - *"What is my highest expense?"*
     - *"Compare June and July."*
   - 0% hallucination — all answers are aggregated directly from MongoDB records.

3. **Daily Ledger & Multi-Criteria Filtering**:
   - Paginated ledger with columns for Date, Owner, Type, Description, Category, Payment Method, Amount, and Actions.
   - Live search, owner filters, type filters, and date range filters.

4. **Interactive Financial Analytics**:
   - Recharts visualizations: Income vs Expense, Daily Spending Trend area chart, Category Donut Breakdown, and Family Owner Breakdown.

5. **Budget Monitoring & Threshold Alerts**:
   - Monthly category limits with automated color-coded warning banners at **80%**, **90%**, and **100% (exceeded)**.

6. **Savings Goals & Upcoming Bills**:
   - Set savings targets with progress bars and instant deposit shortcuts.
   - Track bill statuses (Upcoming, Due Soon, Overdue, Paid) with mark-paid capability.

7. **GitHub-Style Spending Heatmap**:
   - 120-day contribution grid showing daily spending intensity (Green = Low, Orange = Medium, Red = High). Click any day cell to view exact transaction details.

8. **Export & Settings**:
   - Export filtered transactions to CSV spreadsheet or printable PDF statement.
   - Multi-currency support (`₹ INR`, `$ USD`, `€ EUR`, `£ GBP`), dark/light theme toggle, and one-click demo data populator.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Lucide React, Recharts, Framer Motion.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB + Mongoose ODM (with automatic fallback to `mongodb-memory-server` if local MongoDB is not running).
- **Authentication**: JWT tokens + bcrypt password hashing.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Environment Variables

Create `.env` in `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spendx
JWT_SECRET=spendx_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

---

## 💻 Running the Application

From the project root:
```bash
npm run dev
```

- **Backend Server**: http://localhost:5000
- **Frontend Client**: http://localhost:5173
