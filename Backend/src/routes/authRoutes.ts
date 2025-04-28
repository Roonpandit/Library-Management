import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validateResource } from '../middleware/validateResource';
import { userSchema, loginSchema } from '../utils/validation';

const router = express.Router();

router.post('/register', validateResource(userSchema), registerUser);
router.post('/login', validateResource(loginSchema), loginUser);
router.get('/profile', protect, getUserProfile);

export default router;