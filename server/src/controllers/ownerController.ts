import { Response } from 'express';
import mongoose from 'mongoose';
import AccountOwner from '../models/AccountOwner';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAccountOwners = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    let owners = await AccountOwner.find({ user: userId }).sort({ isSystem: -1, createdAt: 1 });

    if (owners.length === 0) {
      // Create defaults if not found
      const userObjId = new mongoose.Types.ObjectId(userId);
      const defaultOwners = [
        { user: userObjId, name: 'Me', relationship: 'Me', color: '#14F195', isSystem: true },
        { user: userObjId, name: 'Father', relationship: 'Father', color: '#3B82F6', isSystem: true },
        { user: userObjId, name: 'Mother', relationship: 'Mother', color: '#8B5CF6', isSystem: true },
        { user: userObjId, name: 'Family', relationship: 'Family', color: '#F59E0B', isSystem: true },
      ];
      owners = await AccountOwner.insertMany(defaultOwners);
    }

    res.json({ success: true, owners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAccountOwner = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, relationship = 'Other', color = '#3B82F6' } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Owner name is required.' });
    }

    const existing = await AccountOwner.findOne({ user: userId, name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account owner with this name already exists.' });
    }

    const owner = await AccountOwner.create({
      user: userId,
      name,
      relationship,
      color,
      isSystem: false,
    });

    res.status(201).json({ success: true, owner });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAccountOwner = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const owner = await AccountOwner.findOne({ _id: id, user: userId });
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found.' });

    if (owner.isSystem) {
      return res.status(400).json({ success: false, message: 'System account owners cannot be deleted.' });
    }

    await owner.deleteOne();
    res.json({ success: true, message: 'Owner removed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
