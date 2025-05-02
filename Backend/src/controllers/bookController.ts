import { Request, Response } from "express";
import Book from "../models/Book";
import { validate, bookSchema } from "../utils/validation";
import cloudinary from "../config/cloudinary";
import fs from "fs";

const getPublicIdFromUrl = (url: string): string | null => {
  if (!url) return null;

  try {
    const splitUrl = url.split("/");
    const filenameWithExt = splitUrl[splitUrl.length - 1];
    const foldername = splitUrl[splitUrl.length - 2];
    const publicId = `${foldername}/${filenameWithExt.split(".")[0]}`;
    return publicId;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, bookSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    let imageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "library",
        quality: "auto:best",
        fetch_format: "auto",
        flags: "preserve_transparency",
      });

      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const bookData = {
      ...(typeof data === "object" && data !== null ? data : {}),
      imageUrl,
    } as any;

    const book = await Book.create(bookData);

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, bookSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let imageUrl = book.imageUrl;
    if (req.file) {
      if (book.imageUrl) {
        const publicId = getPublicIdFromUrl(book.imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Successfully deleted previous image: ${publicId}`);
          } catch (deleteError) {
            console.error(
              `Error deleting previous image: ${publicId}`,
              deleteError
            );
          }
        }
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "library",
        quality: "auto:best",
        fetch_format: "auto",
        flags: "preserve_transparency",
      });

      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const bookData = {
      ...(typeof data === "object" && data !== null ? data : {}),
      imageUrl,
    } as any;

    book = await Book.findByIdAndUpdate(req.params.id, bookData, {
      new: true,
      runValidators: true,
    });

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.imageUrl) {
      const publicId = getPublicIdFromUrl(book.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Successfully deleted image for book: ${publicId}`);
        } catch (deleteError) {
          console.error(
            `Error deleting image for book: ${publicId}`,
            deleteError
          );
        }
      }
    }

    await book.deleteOne();
    res.json({ message: "Book removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
