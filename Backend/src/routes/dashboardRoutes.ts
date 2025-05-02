import express from "express";
import {
  getUserDashboard,
  getAdminDashboard,
  getUserDashboardBooks,
  getUserDashboardBorrowed,
  getUserDashboardOverdue,
  getUserDashboardReturned,
  getAdminDashboardActiveUsers,
  getAdminDashboardBooks,
  getAdminDashboardOverduePayments,
  getAdminDashboardBlockedUsers,
  getAdminDashboardReturnedBooks,
} from "../controllers/dashboardController";
import { protect, admin } from "../middleware/auth";

const router = express.Router();

router.get("/user", protect, getUserDashboard);
router.get("/user/books", protect, getUserDashboardBooks);
router.get("/user/borrowed", protect, getUserDashboardBorrowed);
router.get("/user/overdue", protect, getUserDashboardOverdue);
router.get("/user/returned", protect, getUserDashboardReturned);

router.get("/admin", protect, admin, getAdminDashboard);
router.get("/admin/active-users", protect, admin, getAdminDashboardActiveUsers);
router.get("/admin/books", protect, admin, getAdminDashboardBooks);
router.get(
  "/admin/overdue-payments",
  protect,
  admin,
  getAdminDashboardOverduePayments
);
router.get(
  "/admin/blocked-users",
  protect,
  admin,
  getAdminDashboardBlockedUsers
);
router.get(
  "/admin/returned-books",
  protect,
  admin,
  getAdminDashboardReturnedBooks
);

export default router;
