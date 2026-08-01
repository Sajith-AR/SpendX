import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AccountOwner from '../models/AccountOwner';
import { seedUserDemoData } from '../utils/seedData';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'finora_super_secret_jwt_key_2026';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create default owners: Me, Father, Mother, Family
    const defaultOwners = [
      { name: 'Me', relationship: 'Me', color: '#14F195', isSystem: true },
      { name: 'Father', relationship: 'Father', color: '#3B82F6', isSystem: true },
      { name: 'Mother', relationship: 'Mother', color: '#8B5CF6', isSystem: true },
      { name: 'Family', relationship: 'Family', color: '#F59E0B', isSystem: true },
    ];

    for (const owner of defaultOwners) {
      await AccountOwner.create({
        user: user._id,
        ...owner,
      });
    }

    // Seed demo data for rich initial experience if requested or default
    await seedUserDemoData(user._id.toString());

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        defaultCurrency: user.defaultCurrency,
        dateFormat: user.dateFormat,
        theme: user.theme,
        defaultOwner: user.defaultOwner,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server registration error.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        defaultCurrency: user.defaultCurrency,
        dateFormat: user.dateFormat,
        theme: user.theme,
        defaultOwner: user.defaultOwner,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server login error.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, defaultCurrency, dateFormat, theme, defaultOwner, notificationsEnabled } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (name) user.name = name;
    if (defaultCurrency) user.defaultCurrency = defaultCurrency;
    if (dateFormat) user.dateFormat = dateFormat;
    if (theme) user.theme = theme;
    if (defaultOwner) user.defaultOwner = defaultOwner;
    if (typeof notificationsEnabled === 'boolean') user.notificationsEnabled = notificationsEnabled;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        defaultCurrency: user.defaultCurrency,
        dateFormat: user.dateFormat,
        theme: user.theme,
        defaultOwner: user.defaultOwner,
        notificationsEnabled: user.notificationsEnabled,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedDemo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    await seedUserDemoData(userId);
    res.json({ success: true, message: 'Demo financial data loaded successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
