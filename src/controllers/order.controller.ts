import { Request, Response } from 'express';

// Helper to safely extract error messages
const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

// Local user shape expected on req.user (from auth middleware)
type LocalUser = { userId?: string; email?: string; role?: string; _id?: string };
import {
  createOrderService,
  getAllOrdersService,
  getUserOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  cancelOrderService,
} from '../services/order.service';

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: LocalUser }).user;
    const userId = user?.userId || user?._id;
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item',
      });
    }

    // Create order with user data
    const order = await createOrderService({
      userId,
      email: user?.email,
      items,
      shippingAddress,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to create order',
    });
  }
};

// Get user's orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: LocalUser }).user;
    const userId = user?.userId || user?._id;
    const orders = await getUserOrdersService(userId as string);

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully!',
      data: orders,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to fetch orders',
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersService();

    res.status(200).json({
      success: true,
      message: 'All orders fetched successfully!',
      data: orders,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to fetch orders',
    });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderByIdService(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully!',
      data: order,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to fetch order',
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await updateOrderStatusService(orderId, status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully!',
      data: order,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to update order status',
    });
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const user = (req as Request & { user?: LocalUser }).user;
    const userId = user?.userId || user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

  const order = await cancelOrderService(orderId, userId as string);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully!',
      data: order,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to cancel order',
    });
  }
};
