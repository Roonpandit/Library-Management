import { Request, Response } from "express";
import Book from "../models/Book";
import User from "../models/User";
import Borrow from "../models/Borrow";

export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const totalBooks = await Book.countDocuments();

    const userBorrows = await Borrow.find({ userId });

    const totalBorrowed = await Borrow.countDocuments({
      userId,
      returnDate: null,
    });

    const today = new Date();
    const overdueReturns = await Borrow.countDocuments({
      userId,
      borrowedTill: { $lt: today },
      returnDate: null,
    });

    const returned = await Borrow.countDocuments({
      userId,
      returnDate: { $ne: null },
    });

    res.json({
      totalBooks,
      totalBorrowed,
      overdueReturns,
      returned,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const activeUsers = await User.countDocuments({
      role: "user",
      isBlocked: false,
    });

    const totalBooks = await Book.countDocuments();

    const overduePayments = await Borrow.countDocuments({
      returnDate: { $ne: null },
      paymentStatus: "pending",
    });

    const blockedUsers = await User.countDocuments({
      role: "user",
      isBlocked: true,
    });

    const returnedBooks = await Borrow.countDocuments({
      returnDate: { $ne: null },
      paymentStatus: "pending",
    });

    res.json({
      activeUsers,
      totalBooks,
      overduePayments,
      blockedUsers,
      returnedBooks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserDashboardBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserDashboardBorrowed = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const borrowed = await Borrow.find({
      userId,
      returnDate: null,
    }).populate("bookId", "title author imageUrl chargePerDay");

    res.json(borrowed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserDashboardOverdue = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const today = new Date();

    const overdue = await Borrow.find({
      userId,
      borrowedTill: { $lt: today },
      returnDate: null,
    }).populate("bookId", "title author imageUrl chargePerDay");

    res.json(overdue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserDashboardReturned = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const returned = await Borrow.find({
      userId,
      returnDate: { $ne: null },
    })
      .populate("bookId", "title author imageUrl chargePerDay")
      .sort({ returnDate: -1 });

    res.json(returned);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminDashboardActiveUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find({
      role: "user",
      isBlocked: false,
    })
      .select("-password")
      .populate({
        path: "borrowedBooks.bookId",
        select: "title author imageUrl",
      });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminDashboardBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminDashboardOverduePayments = async (
  req: Request,
  res: Response
) => {
  try {
    const overduePayments = await Borrow.find({
      returnDate: { $ne: null },
      paymentStatus: "pending",
    })
      .populate("userId", "name email")
      .populate("bookId", "title author imageUrl");

    res.json(overduePayments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminDashboardBlockedUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const blockedUsers = await User.find({
      role: "user",
      isBlocked: true,
    })
      .select("-password")
      .populate({
        path: "borrowedBooks.bookId",
        select: "title author imageUrl",
      });

    res.json(blockedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminDashboardReturnedBooks = async (
  req: Request,
  res: Response
) => {
  try {
    const returnedBooks = await Borrow.find({
      returnDate: { $ne: null },
      paymentStatus: "pending",
    })
      .populate("userId", "name email")
      .populate("bookId", "title author imageUrl chargePerDay");

    res.json(returnedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
