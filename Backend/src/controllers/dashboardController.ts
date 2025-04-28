import { Request, Response } from 'express';
import Book from '../models/Book';
import User from '../models/User';
import Borrow from '../models/Borrow';

// @desc    Get user dashboard data
// @route   GET /api/dashboard/user
// @access  Private
export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    // Total books
    const totalBooks = await Book.countDocuments();
    
    // User's borrows
    const userBorrows = await Borrow.find({ userId });
    
    // Total borrowed (currently)
    const totalBorrowed = await Borrow.countDocuments({
      userId,
      returnDate: null
    });
    
    // Overdue returns
    const today = new Date();
    const overdueReturns = await Borrow.countDocuments({
      userId,
      borrowedTill: { $lt: today },
      returnDate: null
    });
    
    // Returned
    const returned = await Borrow.countDocuments({
      userId,
      returnDate: { $ne: null }
    });
    
    res.json({
      totalBooks,
      totalBorrowed,
      overdueReturns,
      returned
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    // Active users
    const activeUsers = await User.countDocuments({
      role: 'user',
      isBlocked: false
    });
    
    // Total books
    const totalBooks = await Book.countDocuments();
    
    // Overdue payments
    const overduePayments = await Borrow.countDocuments({
      returnDate: { $ne: null },
      paymentStatus: 'pending'
    });
    
    // Blocked users
    const blockedUsers = await User.countDocuments({
      role: 'user',
      isBlocked: true
    });
    
    // Returned books (payment pending)
    const returnedBooks = await Borrow.countDocuments({
      returnDate: { $ne: null },
      paymentStatus: 'pending'
    });
    
    res.json({
      activeUsers,
      totalBooks,
      overduePayments,
      blockedUsers,
      returnedBooks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get books list for user dashboard
// @route   GET /api/dashboard/user/books
// @access  Private
export const getUserDashboardBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get borrowed books for user dashboard
// @route   GET /api/dashboard/user/borrowed
// @access  Private
export const getUserDashboardBorrowed = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const borrowed = await Borrow.find({
      userId,
      returnDate: null
    }).populate('bookId', 'title author imageUrl chargePerDay');
    
    res.json(borrowed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get overdue books for user dashboard
// @route   GET /api/dashboard/user/overdue
// @access  Private
export const getUserDashboardOverdue = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    
    const overdue = await Borrow.find({
      userId,
      borrowedTill: { $lt: today },
      returnDate: null
    }).populate('bookId', 'title author imageUrl chargePerDay');
    
    res.json(overdue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get returned books for user dashboard
// @route   GET /api/dashboard/user/returned
// @access  Private
export const getUserDashboardReturned = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const returned = await Borrow.find({
      userId,
      returnDate: { $ne: null }
    })
      .populate('bookId', 'title author imageUrl chargePerDay')
      .sort({ returnDate: -1 });
    
    res.json(returned);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get active users for admin dashboard
// @route   GET /api/dashboard/admin/active-users
// @access  Private/Admin
export const getAdminDashboardActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      role: 'user',
      isBlocked: false
    })
      .select('-password')
      .populate({
        path: 'borrowedBooks.bookId',
        select: 'title author imageUrl'
      });
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get books for admin dashboard
// @route   GET /api/dashboard/admin/books
// @access  Private/Admin
export const getAdminDashboardBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get overdue payments for admin dashboard
// @route   GET /api/dashboard/admin/overdue-payments
// @access  Private/Admin
export const getAdminDashboardOverduePayments = async (req: Request, res: Response) => {
  try {
    const overduePayments = await Borrow.find({
      returnDate: { $ne: null },
      paymentStatus: 'pending'
    })
      .populate('userId', 'name email')
      .populate('bookId', 'title author imageUrl');
    
    res.json(overduePayments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get blocked users for admin dashboard
// @route   GET /api/dashboard/admin/blocked-users
// @access  Private/Admin
export const getAdminDashboardBlockedUsers = async (req: Request, res: Response) => {
  try {
    const blockedUsers = await User.find({
      role: 'user',
      isBlocked: true
    })
      .select('-password')
      .populate({
        path: 'borrowedBooks.bookId',
        select: 'title author imageUrl'
      });
    
    res.json(blockedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get returned books for admin dashboard
// @route   GET /api/dashboard/admin/returned-books
// @access  Private/Admin
export const getAdminDashboardReturnedBooks = async (req: Request, res: Response) => {
  try {
    const returnedBooks = await Borrow.find({
      returnDate: { $ne: null },
      paymentStatus: 'pending'
    })
      .populate('userId', 'name email')
      .populate('bookId', 'title author imageUrl chargePerDay');
    
    res.json(returnedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};