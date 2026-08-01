# Finora — Smart Personal & Family Finance Management Platform

**Finora** is a portfolio-grade, full-stack personal & family finance platform designed to track spending, manage shared household accounts, build category budgets with visual warning alerts, monitor savings goals, manage upcoming bills, view GitHub-style spending heatmaps, and query real stored financial data with a deterministic 0%-hallucination AI assistant.

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

**Option A (Root Convenient Install)**:
```bash
npm run install:all
```

**Option B (Manual Install)**:
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Environment Variables

Create `.env` in `server/` (automatically pre-configured):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finora
JWT_SECRET=finora_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```
*Note: If `MONGODB_URI` is empty or MongoDB service is not running locally, the server automatically starts an in-memory MongoDB instance (`mongodb-memory-server`), ensuring zero-setup execution.*

---

## 💻 Running the Application

### Option A: Run Both Concurrently (Recommended)
From the project root:
```bash
npm install
npm run dev
```

### Option B: Run Services Separately

**Start Backend Server**:
```bash
cd server
npm run dev
```
*Backend runs on http://localhost:5000*

**Start Frontend Client**:
```bash
cd client
npm run dev
```
*Frontend runs on http://localhost:5173*

---

## 🧪 Seeding Demo Data

To populate realistic sample transactions (including transactions on `07/05/2026`, June/July comparison data, budgets, goals, and bills):
1. Sign in to the app or click **View Demo** on the landing page.
2. Go to **Settings** → click **Populate Demo Data**.

---

## 📁 Project Structure

```
SpendX/
├── client/
│   ├── src/
│   │   ├── components/       # UI, Layout, Dashboard, Ledger, Analytics, Heatmap, AI, Budget, Goals, Bills
│   │   ├── context/          # AuthContext, FinanceContext, ThemeContext
│   │   ├── pages/            # Landing, Login, Register, Dashboard, Ledger, Analytics, Budgets, Goals, Heatmap, Bills, Family, Settings
│   │   ├── services/         # API fetch client
│   │   ├── types/            # TypeScript interface definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── config/           # DB connection & MongoMemoryServer fallback
│   │   ├── controllers/      # Auth, Transaction, Owner, Budget, Goal, Bill, AI, Export controllers
│   │   ├── middleware/       # JWT Auth Middleware
│   │   ├── models/           # Mongoose models (User, AccountOwner, Transaction, Budget, Goal, Bill, Notification)
│   │   ├── routes/           # Express API endpoints
│   │   ├── services/         # AI Financial Query Engine & CSV/PDF Export Service
│   │   ├── utils/            # Seed data utility
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── README.md
```
