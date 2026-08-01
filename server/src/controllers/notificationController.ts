import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    const unreadCount = await Notification.countDocuments({ user: userId, read: false });

    res.json({ success: true, notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (id === 'all') {
      await Notification.updateMany({ user: userId, read: false }, { read: true });
    } else {
      await Notification.findOneAndUpdate({ _id: id, user: userId }, { read: true });
    }

    res.json({ success: true, message: 'Notification(s) updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
