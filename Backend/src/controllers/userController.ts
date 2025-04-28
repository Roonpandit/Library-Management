import { Request, Response } from 'express';
import User from '../models/User';
import Borrow from '../models/Borrow';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      // Get user's borrowed books details
      const userWithBorrows = await User.findById(req.params.id)
        .select('-password')
        .populate({
          path: 'borrowedBooks.bookId',
          select: 'title author imageUrl'
        });
      
      res.json(userWithBorrows);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Block/Unblock user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
export const toggleBlockUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isBlocked = !user.isBlocked;
    
    // Add notification
    if (user.isBlocked) {
      user.notifications.push({
        message: 'Your account has been blocked. Please contact admin for assistance.',
        date: new Date(),
        read: false
      });
    } else {
      user.notifications.push({
        message: 'Your account has been unblocked. You can now borrow books.',
        date: new Date(),
        read: false
      });
    }
    
    await user.save();
    
    res.json({
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked: user.isBlocked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Send reminder to user
// @route   POST /api/users/:id/remind
// @access  Private/Admin
export const sendReminder = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Please provide a reminder message' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add notification
    user.notifications.push({
      message,
      date: new Date(),
      read: false
    });
    
    await user.save();
    
    res.json({
      message: 'Reminder sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get blocked users
// @route   GET /api/users/blocked
// @access  Private/Admin
export const getBlockedUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ 
      role: 'user',
      isBlocked: true 
    }).select('-password');
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get active users
// @route   GET /api/users/active
// @access  Private/Admin
export const getActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ 
      role: 'user',
      isBlocked: false 
    }).select('-password');
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id
// @access  Private
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const notificationIndex = user.notifications.findIndex(
      (n: any) => n._id?.toString() === notificationId
    );
    
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    user.notifications[notificationIndex].read = true;
    await user.save();
    
    res.json({
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};