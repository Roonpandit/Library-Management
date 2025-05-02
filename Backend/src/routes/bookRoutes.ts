import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { protect, admin } from "../middleware/auth";
import upload from "../config/upload";
import { validateResource } from "../middleware/validateResource";
import { bookSchema } from "../utils/validation";

const router = express.Router();

router
  .route("/")
  .get(getBooks)
  .post(
    protect,
    admin,
    upload.single("image"),
    validateResource(bookSchema),
    createBook
  );

router
  .route("/:id")
  .get(getBookById)
  .put(
    protect,
    admin,
    upload.single("image"),
    validateResource(bookSchema),
    updateBook
  )
  .delete(protect, admin, deleteBook);

export default router;
