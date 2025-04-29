import { Request, Response } from 'express';
import Borrow from '../models/Borrow';
import Book from '../models/Book';
import User from '../models/User';
import { validate, borrowSchema, billSchema } from '../utils/validation';

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, borrowSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const { bookId, borrowedTill } = data as any;
    const userId = req.user._id;

    // Check if user is blocked
    const user = await User.findById(userId);
    if (user?.isBlocked) {
      return res.status(403).json({ message: 'You are blocked from borrowing books' });
    }

    // Check if book exists and available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.copiesAvailable <= 0) {
      return res.status(400).json({ message: 'Book not available for borrowing' });
    }

    // Check if user already has this book
    const alreadyBorrowed = await Borrow.findOne({
      userId,
      bookId,
      returnDate: null
    });

    if (alreadyBorrowed) {
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }

    // Create borrow record
    const borrow = await Borrow.create({
      userId,
      bookId,
      borrowDate: new Date(),
      borrowedTill: new Date(borrowedTill)
    });

    // Update book availability
    book.copiesAvailable -= 1;
    await book.save();

    // Update user's borrowed books
    user?.borrowedBooks.push({
      bookId: book._id,
      borrowDate: new Date(),
      borrowedTill: new Date(borrowedTill)
    });
    await user?.save();

    res.status(201).json(borrow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Return a book
// @route   PUT /api/borrow/:id/return
// @access  Private
export const returnBook = async (req: Request, res: Response) => {
  try {
    const borrowId = req.params.id;
    const userId = req.user._id;

    // Find the borrow record
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    // Check if this belongs to the user
    if (borrow.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if already returned
    if (borrow.returnDate) {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Update book availability
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.copiesAvailable += 1;
      await book.save();
    }

    // Calculate charges
    const returnDate = new Date();
    const borrowDate = new Date(borrow.borrowDate);
    const borrowedTill = new Date(borrow.borrowedTill);

    // Calculate days borrowed
    const daysBorrowed = Math.ceil((returnDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
  
    // Calculate if return is late
    const isLate = returnDate > borrowedTill;
  
    // Calculate regular charge
    const regularCharge = daysBorrowed * book!.chargePerDay;
    
    // Calculate late fee - 5 times daily charge for each day late
    let lateFee = 0;
    if (isLate) {
      const daysLate = Math.ceil((returnDate.getTime() - borrowedTill.getTime()) / (1000 * 60 * 60 * 24));
      lateFee = 5 * book!.chargePerDay * daysLate;
    }
    
    // Calculate total amount
    const totalAmount = regularCharge + lateFee;
  
    // Update borrow record
    borrow.returnDate = returnDate;
    borrow.bill = {
      amount: regularCharge,
      lateFee: lateFee,
      totalAmount: totalAmount,
      isLate: isLate,
      generatedDate: new Date(),
      bookISBN: book?.ISBN
    };
    await borrow.save();

    // Update user's borrowed books
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
          bookISBN: book?.ISBN
        };
        await user.save();
      }
    }

    res.json({
      message: 'Book returned successfully',
      bill: {
        amount: regularCharge,
        lateFee: lateFee,
        totalAmount: totalAmount,
        isLate,
        bookISBN: book?.ISBN
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Generate bill for returned book
// @route   PUT /api/borrow/:id/bill
// @access  Private/Admin
export const generateBill = async (req: Request, res: Response) => {
try {
  const { valid, data, errors } = validate(req.body, billSchema);

  if (!valid) {
    return res.status(400).json({ errors });
  }

  const { borrowId, lateFee = 0 } = data as any;

  // Find the borrow record
  const borrow = await Borrow.findById(borrowId);
  if (!borrow) {
    return res.status(404).json({ message: 'Borrow record not found' });
  }

  // Check if returned
  if (!borrow.returnDate) {
    return res.status(400).json({ message: 'Book not yet returned' });
  }

  // Check if bill already generated
  if (borrow.bill && borrow.bill.generatedDate) {
    // Get book details to include ISBN
    const book = await Book.findById(borrow.bookId);
    
    // Update existing bill
    const totalAmount = borrow.bill.amount + Number(lateFee);
    
    borrow.bill = {
      ...borrow.bill,
      lateFee: Number(lateFee),
      totalAmount,
      isLate: borrow.bill.isLate || lateFee > 0,
      generatedDate: new Date(),
      bookISBN: book?.ISBN || borrow.bill.bookISBN
    };
  } else {
    return res.status(400).json({ message: 'No bill data found' });
  }

  await borrow.save();

  // Update user's bill
  const user = await User.findById(borrow.userId);
  if (user) {
    const borrowedBookIndex = user.borrowedBooks.findIndex(
      (b) => b.bookId.toString() === borrow.bookId.toString() && 
            b.returnDate && 
            new Date(b.returnDate).getTime() === new Date(borrow.returnDate!).getTime()
    );
    
    if (borrowedBookIndex !== -1 && user.borrowedBooks[borrowedBookIndex].bill) {
      const totalAmount = user.borrowedBooks[borrowedBookIndex].bill!.amount + Number(lateFee);
      
      user.borrowedBooks[borrowedBookIndex].bill = {
        ...user.borrowedBooks[borrowedBookIndex].bill!,
        lateFee: Number(lateFee),
        totalAmount,
        isLate: user.borrowedBooks[borrowedBookIndex].bill!.isLate || lateFee > 0,
        generatedDate: new Date(),
        bookISBN: borrow.bill.bookISBN
      };
      
      // Add notification
      user.notifications.push({
        message: `Your bill for the book has been generated. Total amount: $${totalAmount}`,
        date: new Date(),
        read: false
      });
      
      await user.save();
    }
  }

  res.json({
    message: 'Bill generated successfully',
    bill: borrow.bill
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server Error' });
}
};

// @desc    Update payment status
// @route   PUT /api/borrow/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req: Request, res: Response) => {
try {
  const borrowId = req.params.id;

  // Find the borrow record
  const borrow = await Borrow.findById(borrowId);
  if (!borrow) {
    return res.status(404).json({ message: 'Borrow record not found' });
  }

  // Check if returned
  if (!borrow.returnDate) {
    return res.status(400).json({ message: 'Book not yet returned' });
  }

  // Check if bill generated
  if (!borrow.bill || !borrow.bill.generatedDate) {
    return res.status(400).json({ message: 'Bill not yet generated' });
  }

  // Update payment status
  borrow.paymentStatus = 'paid';
  await borrow.save();

  // Update user's payment status
  const user = await User.findById(borrow.userId);
  if (user) {
    const borrowedBookIndex = user.borrowedBooks.findIndex(
      (b) => b.bookId.toString() === borrow.bookId.toString() && 
            b.returnDate && 
            new Date(b.returnDate).getTime() === new Date(borrow.returnDate!).getTime()
    );
    
    if (borrowedBookIndex !== -1) {
      user.borrowedBooks[borrowedBookIndex].paymentStatus = 'paid';
      
      // Add notification
      user.notifications.push({
        message: `Your payment for the book has been marked as paid.`,
        date: new Date(),
        read: false
      });
      
      await user.save();
    }
  }

  res.json({
    message: 'Payment status updated successfully',
    paymentStatus: borrow.paymentStatus
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server Error' });
}
};

// @desc    Get all borrows
// @route   GET /api/borrow
// @access  Private/Admin
export const getAllBorrows = async (req: Request, res: Response) => {
try {
  const borrows = await Borrow.find({})
    .populate('userId', 'name email')
    .populate('bookId', 'title author imageUrl');
  
  res.json(borrows);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server Error' });
}
};

// @desc    Get user's borrows
// @route   GET /api/borrow/user
// @access  Private
export const getUserBorrows = async (req: Request, res: Response) => {
try {
  const userId = req.user._id;
  
  const borrows = await Borrow.find({ userId })
    .populate('bookId', 'title author imageUrl chargePerDay');
  
  res.json(borrows);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server Error' });
}
};

// @desc    Get overdue borrows
// @route   GET /api/borrow/overdue
// @access  Private/Admin
export const getOverdueBorrows = async (req: Request, res: Response) => {
try {
  const today = new Date();
  
  const borrows = await Borrow.find({
    borrowedTill: { $lt: today },
    returnDate: null
  })
    .populate('userId', 'name email')
    .populate('bookId', 'title author imageUrl');
  
  res.json(borrows);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server Error' });
}
};

// @desc    Get returned books with pending payment
// @route   GET /api/borrow/pending-payment
// @access  Private/Admin
export const getPendingPayments = async (req: Request, res: Response) => {
try {
  const borrows = await Borrow.find({
    returnDate: { $ne: null },
    paymentStatus: 'pending'
  })
    .populate('userId', 'name email')
    .populate('bookId', 'title author imageUrl');
  
  res.json(borrows);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server Error' });
}
};