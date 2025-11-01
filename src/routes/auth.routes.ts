import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
  deleteUser,
  createAdmin,
} from '../controllers/auth.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// ⚠️ DEVELOPMENT ONLY - Remove this in production!
router.post('/create-admin', createAdmin);

// Protected routes (require authentication)
router.use(protect); // All routes after this require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

// Admin only routes
router.get('/users', restrictTo('admin'), getAllUsers);
router.delete('/users/:userId', restrictTo('admin'), deleteUser);

export default router;
