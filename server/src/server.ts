import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import ownerRoutes from './routes/ownerRoutes';
import budgetRoutes from './routes/budgetRoutes';
import goalRoutes from './routes/goalRoutes';
import billRoutes from './routes/billRoutes';
import notificationRoutes from './routes/notificationRoutes';
import aiRoutes from './routes/aiRoutes';
import exportRoutes from './routes/exportRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Finora API Server', timestamp: new Date() });
});

// Start Server after DB Connect
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Finora Server] Running on http://localhost:${PORT}`);
  });
});
