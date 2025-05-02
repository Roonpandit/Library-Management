import express from "express";
import {
  getUsers,
  getUserById,
  toggleBlockUser,
  sendReminder,
  getBlockedUsers,
  getActiveUsers,
  markNotificationAsRead,
} from "../controllers/userController";
import { protect, admin } from "../middleware/auth";

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.get("/blocked", protect, admin, getBlockedUsers);
router.get("/active", protect, admin, getActiveUsers);
router.put("/notifications/:id", protect, markNotificationAsRead);

router.route("/:id").get(protect, admin, getUserById);

router.route("/:id/block").put(protect, admin, toggleBlockUser);

router.route("/:id/remind").post(protect, admin, sendReminder);

export default router;
