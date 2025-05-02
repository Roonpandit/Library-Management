import { Request, Response } from "express";
import Borrow from "../models/Borrow";
import Book from "../models/Book";
import User from "../models/User";
import { validate, borrowSchema, billSchema } from "../utils/validation";

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, borrowSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const { bookId, borrowedTill } = data as any;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (user?.isBlocked) {
      return res
        .status(403)
        .json({ message: "You are blocked from borrowing books" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.copiesAvailable <= 0) {
      return res
        .status(400)
        .json({ message: "Book not available for borrowing" });
    }

    const alreadyBorrowed = await Borrow.findOne({
      userId,
      bookId,
      returnDate: null,
    });

    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({ message: "You have already borrowed this book" });
    }

    const borrow = await Borrow.create({
      userId,
      bookId,
      borrowDate: new Date(),
      borrowedTill: new Date(borrowedTill),
    });

    book.copiesAvailable -= 1;
    await book.save();

    user?.borrowedBooks.push({
      bookId: book._id,
      borrowDate: new Date(),
      borrowedTill: new Date(borrowedTill),
    });
    await user?.save();

    res.status(201).json(borrow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const borrowId = req.params.id;
    const userId = req.user._id;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (borrow.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (borrow.returnDate) {
      return res.status(400).json({ message: "Book already returned" });
    }

    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.copiesAvailable += 1;
      await book.save();
    }

    const returnDate = new Date();
    const borrowDate = new Date(borrow.borrowDate);
    const borrowedTill = new Date(borrow.borrowedTill);

    const daysBorrowed = Math.ceil(
      (returnDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isLate = returnDate > borrowedTill;

    const regularCharge = daysBorrowed * book!.chargePerDay;

    let lateFee = 0;
    if (isLate) {
      const daysLate = Math.ceil(
        (returnDate.getTime() - borrowedTill.getTime()) / (1000 * 60 * 60 * 24)
      );
      lateFee = 5 * book!.chargePerDay * daysLate;
    }

    const totalAmount = regularCharge + lateFee;

    borrow.returnDate = returnDate;
    borrow.bill = {
      amount: regularCharge,
      lateFee: lateFee,
      totalAmount: totalAmount,
      isLate: isLate,
      generatedDate: new Date(),
      bookISBN: book?.ISBN,
    };
    await borrow.save();

    const user = await User.findById(userId);
    if (user) {
      const borrowedBookIndex = user.borrowedBooks.findIndex(
        (b) => b.bookId.toString() === borrow.bookId.toString() && !b.returnDate
      );

      if (borrowedBookIndex !== -1) {
        user.borrowedBooks[borrowedBookIndex].returnDate = returnDate;
        user.borrowedBooks[borrowedBookIndex].bill = {
          amount: regularCharge,
          lateFee: lateFee,
          totalAmount: totalAmount,
          isLate: isLate,
          generatedDate: new Date(),
          bookISBN: book?.ISBN,
        };
        await user.save();
      }
    }

    res.json({
      message: "Book returned successfully",
      bill: {
        amount: regularCharge,
        lateFee: lateFee,
        totalAmount: totalAmount,
        isLate,
        bookISBN: book?.ISBN,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const generateBill = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, billSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const { borrowId, lateFee = 0 } = data as any;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (!borrow.returnDate) {
      return res.status(400).json({ message: "Book not yet returned" });
    }

    if (borrow.bill && borrow.bill.generatedDate) {
      const book = await Book.findById(borrow.bookId);

      const totalAmount = borrow.bill.amount + Number(lateFee);

      borrow.bill = {
        ...borrow.bill,
        lateFee: Number(lateFee),
        totalAmount,
        isLate: borrow.bill.isLate || lateFee > 0,
        generatedDate: new Date(),
        bookISBN: book?.ISBN || borrow.bill.bookISBN,
      };
    } else {
      return res.status(400).json({ message: "No bill data found" });
    }

    await borrow.save();

    const user = await User.findById(borrow.userId);
    if (user) {
      const borrowedBookIndex = user.borrowedBooks.findIndex(
        (b) =>
          b.bookId.toString() === borrow.bookId.toString() &&
          b.returnDate &&
          new Date(b.returnDate).getTime() ===
            new Date(borrow.returnDate!).getTime()
      );

      if (
        borrowedBookIndex !== -1 &&
        user.borrowedBooks[borrowedBookIndex].bill
      ) {
        const totalAmount =
          user.borrowedBooks[borrowedBookIndex].bill!.amount + Number(lateFee);

        user.borrowedBooks[borrowedBookIndex].bill = {
          ...user.borrowedBooks[borrowedBookIndex].bill!,
          lateFee: Number(lateFee),
          totalAmount,
          isLate:
            user.borrowedBooks[borrowedBookIndex].bill!.isLate || lateFee > 0,
          generatedDate: new Date(),
          bookISBN: borrow.bill.bookISBN,
        };

        user.notifications.push({
          message: `Your bill for the book has been generated. Total amount: $${totalAmount}`,
          date: new Date(),
          read: false,
        });

        await user.save();
      }
    }

    res.json({
      message: "Bill generated successfully",
      bill: borrow.bill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const borrowId = req.params.id;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (!borrow.returnDate) {
      return res.status(400).json({ message: "Book not yet returned" });
    }

    if (!borrow.bill || !borrow.bill.generatedDate) {
      return res.status(400).json({ message: "Bill not yet generated" });
    }

    borrow.paymentStatus = "paid";
    await borrow.save();

    const user = await User.findById(borrow.userId);
    if (user) {
      const borrowedBookIndex = user.borrowedBooks.findIndex(
        (b) =>
          b.bookId.toString() === borrow.bookId.toString() &&
          b.returnDate &&
          new Date(b.returnDate).getTime() ===
            new Date(borrow.returnDate!).getTime()
      );

      if (borrowedBookIndex !== -1) {
        user.borrowedBooks[borrowedBookIndex].paymentStatus = "paid";

        user.notifications.push({
          message: `Your payment for the book has been marked as paid.`,
          date: new Date(),
          read: false,
        });

        await user.save();
      }
    }

    res.json({
      message: "Payment status updated successfully",
      paymentStatus: borrow.paymentStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllBorrows = async (req: Request, res: Response) => {
  try {
    const borrows = await Borrow.find({})
      .populate("userId", "name email")
      .populate("bookId", "title author imageUrl");

    res.json(borrows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserBorrows = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const borrows = await Borrow.find({ userId }).populate(
      "bookId",
      "title author imageUrl chargePerDay"
    );

    res.json(borrows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOverdueBorrows = async (req: Request, res: Response) => {
  try {
    const today = new Date();

    const borrows = await Borrow.find({
      borrowedTill: { $lt: today },
      returnDate: null,
    })
      .populate("userId", "name email")
      .populate("bookId", "title author imageUrl");

    res.json(borrows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPendingPayments = async (req: Request, res: Response) => {
  try {
    const borrows = await Borrow.find({
      returnDate: { $ne: null },
      paymentStatus: "pending",
    })
      .populate("userId", "name email")
      .populate("bookId", "title author imageUrl");

    res.json(borrows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
