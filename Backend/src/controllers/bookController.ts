import { Request, Response } from 'express';
import Book from '../models/Book';
import { validate, bookSchema } from '../utils/validation';
import cloudinary from '../config/cloudinary';
import fs from 'fs';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, bookSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    let imageUrl;
    if (req.file) {
      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'library',
        transformation: [{ width: 500, height: 700, crop: 'fit' }]
      });
      
      imageUrl = result.secure_url;
      
      // Delete file from server
      fs.unlinkSync(req.file.path);
    }

    const bookData = {
      ...(typeof data === 'object' && data !== null ? data : {}),
      imageUrl
    } as any;

    const book = await Book.create(bookData);

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, bookSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let imageUrl = book.imageUrl;
    if (req.file) {
      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'library',
        transformation: [{ width: 500, height: 700, crop: 'fit' }]
      });
      
      imageUrl = result.secure_url;
      
      // Delete file from server
      fs.unlinkSync(req.file.path);
    }

    const bookData = {
      ...(typeof data === 'object' && data !== null ? data : {}),
      imageUrl
    } as any;

    book = await Book.findByIdAndUpdate(req.params.id, bookData, {
      new: true,
      runValidators: true
    });

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
