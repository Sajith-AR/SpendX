import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { generateCSVExport } from '../services/exportService';

export const exportTransactionsCSV = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const csvContent = await generateCSVExport(userId, req.query);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=Finora_Statement_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
