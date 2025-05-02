import express from "express";
import {
  borrowBook,
  returnBook,
  generateBill,
  updatePaymentStatus,
  getAllBorrows,
  getUserBorrows,
  getOverdueBorrows,
  getPendingPayments,
} from "../controllers/borrowController";
import { protect, admin } from "../middleware/auth";
import { validateResource } from "../middleware/validateResource";
import { borrowSchema, billSchema } from "../utils/validation";

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getAllBorrows)
  .post(protect, validateResource(borrowSchema), borrowBook);

router.get("/user", protect, getUserBorrows);
router.get("/overdue", protect, admin, getOverdueBorrows);
router.get("/pending-payment", protect, admin, getPendingPayments);

router.put("/:id/return", protect, returnBook);
router.put(
  "/:id/bill",
  protect,
  admin,
  validateResource(billSchema),
  generateBill
);
router.put("/:id/payment", protect, admin, updatePaymentStatus);

export default router;
