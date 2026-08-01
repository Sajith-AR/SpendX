import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { processFinancialQuery } from '../services/aiQueryService';

export const askAIAssistant = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { question } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, message: 'Please ask a valid financial question.' });
    }

    const result = await processFinancialQuery(userId, question);

    res.json({
      success: true,
      answer: result.reply,
      summaryData: result.summaryData,
      transactions: result.transactions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'AI assistant error.' });
  }
};
