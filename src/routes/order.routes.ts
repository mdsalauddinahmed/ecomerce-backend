import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// User routes (protected)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/:orderId/cancel', protect, cancelOrder);

// Admin routes (protected + admin only)
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:orderId/status', protect, adminOnly, updateOrderStatus);

export default router;

